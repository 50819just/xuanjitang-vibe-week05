import { createServer } from 'node:http'
import { services, isOnsiteRelevant } from '../src/data/services.js'
import { appConfig } from './config.js'
import {
  createDepositCheckoutPayload,
  queryTradeInfo,
  resolveDepositAmount,
  verifyCheckMacValue,
} from './ecpay.js'
import { createBooking, readBooking, updateBooking } from './bookingStore.js'
import { readEcpayOrder, upsertEcpayOrder } from './paymentStore.js'
import { buildReplyText, replyToLine, verifyLineSignature } from './lineBot.js'

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': appConfig.frontendOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  response.end(JSON.stringify(data))
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': appConfig.frontendOrigin,
  })
  response.end(text)
}

function sendRedirect(response, location) {
  response.writeHead(303, { Location: location })
  response.end()
}

function collectBody(request) {
  return new Promise((resolve, reject) => {
    let data = ''
    let bytes = 0
    request.on('data', (chunk) => {
      bytes += chunk.length
      if (bytes > 65536) {
        reject(new Error('請求內容過大；測試表單上限為 64KB。'))
        return
      }
      data += chunk
    })
    request.on('end', () => resolve(data))
    request.on('error', reject)
  })
}

function parseRequestBody(rawBody, contentType) {
  if (!rawBody) {
    return {}
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(rawBody)
    } catch {
      return {}
    }
  }

  return Object.fromEntries(new URLSearchParams(rawBody))
}

function isApiRoute(pathname, route) {
  return pathname === route
}

const REQUIRED_BOOKING_FIELDS = [
  'serviceType',
  'needSummary',
  'desiredPeriod',
  'contactName',
  'contactPhone',
  'region',
  'contactPreference',
]

function validateBookingPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return '表單資料格式錯誤。'
  const stringFields = [...REQUIRED_BOOKING_FIELDS, 'serviceSpecificNote', 'contactTime', 'onsiteNeed']
  if (stringFields.some(field => payload[field] !== undefined && (typeof payload[field] !== 'string' || payload[field].length > 2000))) return '欄位必須為文字且不能超過 2,000 字。'
  if (!services.some(service => service.id === payload.serviceType)) return '請選擇有效的服務類型。'
  if (!['line', 'phone', 'either'].includes(payload.contactPreference)) return '請選擇有效的聯絡方式。'
  if (isOnsiteRelevant(payload.serviceType) && !['yes', 'no', 'unsure'].includes(payload.onsiteNeed)) return '請說明是否需要到場。'

  const missingField = REQUIRED_BOOKING_FIELDS.find((field) => !String(payload[field] || '').trim())

  if (missingField) {
    return '缺少必填欄位，請確認表單資料完整。'
  }

  if (payload.consent !== true) {
    return '請先勾選資料使用同意，才能送出預約申請。'
  }

  return ''
}

function toSafeBookingSummary(booking) {
  return {
    bookingId: booking.bookingId,
    bookingStatus: booking.bookingStatus,
    serviceType: booking.serviceType,
    requestData: booking.requestData,
    submittedAt: booking.submittedAt,
    confirmedServiceTotal: booking.confirmedServiceTotal,
    depositAmount: booking.depositAmount,
    balanceAmount: booking.balanceAmount,
    paymentStatus: booking.paymentStatus,
    merchantTradeNo: booking.merchantTradeNo,
  }
}

function determinePaymentOutcome(tradeInfo, order) {
  const tradeStatus = String(tradeInfo.tradeStatus || '')
  const amountMatches = Number(tradeInfo.tradeAmt) === Number(order.depositAmount)

  if (tradeStatus === '1' && amountMatches) {
    return 'paid'
  }

  if (tradeStatus === '' || tradeStatus === '0') {
    return 'pending'
  }

  return 'failed'
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, appConfig.appBaseUrl)
  const pathname = url.pathname
  const origin = request.headers.origin
  if (origin && origin !== appConfig.frontendOrigin && !['/api/ecpay/return', '/api/ecpay/order-result'].includes(pathname)) {
    sendJson(response, 403, { success: false, message: '來源網站不允許存取此測試 API' })
    return
  }

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {})
    return
  }

  try {
    if (request.method === 'GET' && pathname === '/api/health') {
      sendJson(response, 200, { success: true, environment: 'stage', service: 'xuanjitang-week05-api' })
      return
    }
    if (request.method === 'POST' && isApiRoute(pathname, '/api/bookings')) {
      const rawBody = await collectBody(request)
      const payload = parseRequestBody(rawBody, request.headers['content-type'] || '')
      const validationMessage = validateBookingPayload(payload)

      if (validationMessage) {
        sendJson(response, 400, { success: false, message: validationMessage })
        return
      }

      const safePayload = Object.fromEntries([...REQUIRED_BOOKING_FIELDS, 'serviceSpecificNote', 'serviceSpecificUnsure', 'contactTime', 'onsiteNeed', 'consent'].filter(key => key in payload).map(key => [key, payload[key]]))
      const booking = createBooking(safePayload)
      sendJson(response, 200, {
        success: true,
        message: '預約申請已送出',
        data: { bookingId: booking.bookingId, bookingStatus: booking.bookingStatus },
      })
      return
    }

    const bookingIdMatch = pathname.match(/^\/api\/bookings\/([^/]+)$/)
    if (request.method === 'GET' && bookingIdMatch) {
      const booking = readBooking(bookingIdMatch[1])

      if (!booking) {
        sendJson(response, 404, { success: false, message: '找不到這筆預約申請' })
        return
      }

      sendJson(response, 200, { success: true, data: toSafeBookingSummary(booking) })
      return
    }

    const demoConfirmMatch = pathname.match(/^\/api\/bookings\/([^/]+)\/demo-confirm$/)
    if (request.method === 'POST' && demoConfirmMatch) {
      if (!appConfig.isDemoConfirmEnabled) {
        sendJson(response, 404, { success: false, message: '找不到 API 路由' })
        return
      }

      const bookingId = demoConfirmMatch[1]
      const booking = readBooking(bookingId)

      if (!booking) {
        sendJson(response, 404, { success: false, message: '找不到這筆預約申請' })
        return
      }

      const rawBody = await collectBody(request)
      const body = parseRequestBody(rawBody, request.headers['content-type'] || '')
      const depositAmount = resolveDepositAmount(body.confirmedServiceTotal)

      if (depositAmount === null) {
        sendJson(response, 400, { success: false, message: '測試服務總價需至少 NT$800' })
        return
      }

      if (booking.paymentStatus === 'paid') {
        sendJson(response, 409, { success: false, message: '已付款測試申請不能重新確認費用' })
        return
      }
      const confirmedServiceTotal = Number(body.confirmedServiceTotal)
      const updated = updateBooking(bookingId, {
        bookingStatus: 'deposit_ready',
        confirmedServiceTotal,
        paymentStatus: 'not_created',
        merchantTradeNo: null,
        depositTier: depositAmount,
        depositAmount,
        balanceAmount: confirmedServiceTotal - depositAmount,
      })

      sendJson(response, 200, { success: true, data: toSafeBookingSummary(updated) })
      return
    }

    const depositOrderMatch = pathname.match(/^\/api\/bookings\/([^/]+)\/deposit-order$/)
    if (request.method === 'POST' && depositOrderMatch) {
      const bookingId = depositOrderMatch[1]
      const booking = readBooking(bookingId)

      if (!booking) {
        sendJson(response, 404, { success: false, message: '找不到這筆預約申請' })
        return
      }

      if (booking.paymentStatus === 'paid') {
        sendJson(response, 409, { success: false, message: '這筆預約訂金已完成付款，無法重複建立交易' })
        return
      }

      if (!['deposit_ready', 'deposit_payment_failed', 'deposit_payment_pending'].includes(booking.bookingStatus)) {
        sendJson(response, 409, { success: false, message: '尚未完成老師人工確認，無法建立預約訂金交易' })
        return
      }

      const expectedDepositAmount = resolveDepositAmount(booking.confirmedServiceTotal)
      if (!expectedDepositAmount || expectedDepositAmount !== booking.depositAmount) {
        sendJson(response, 409, { success: false, message: '訂金級距不合法，請重新人工確認總價' })
        return
      }

      const payload = createDepositCheckoutPayload({
        bookingId,
        depositAmount: booking.depositAmount,
      })

      upsertEcpayOrder({
        merchantTradeNo: payload.merchantTradeNo,
        bookingId,
        checkoutFields: payload.fields,
        depositAmount: booking.depositAmount,
        paymentStatus: 'created',
        createdAt: new Date().toISOString(),
      })

      updateBooking(bookingId, {
        bookingStatus: 'deposit_payment_pending',
        paymentStatus: 'created',
        merchantTradeNo: payload.merchantTradeNo,
      })

      sendJson(response, 200, {
        success: true,
        merchantTradeNo: payload.merchantTradeNo,
        action: payload.action,
        fields: payload.fields,
      })
      return
    }

    if (request.method === 'POST' && isApiRoute(pathname, '/api/ecpay/order-result')) {
      const rawBody = await collectBody(request)
      const result = parseRequestBody(rawBody, request.headers['content-type'] || '')
      const merchantTradeNo = result.MerchantTradeNo || 'unknown'
      const isVerified = verifyCheckMacValue(result)
      const order = readEcpayOrder(merchantTradeNo)

      if (!isVerified || !order || String(result.MerchantID) !== appConfig.merchantId || Number(result.TradeAmt) !== Number(order.depositAmount)) {
        sendText(response, 400, '0|Invalid callback')
        return
      }
      if (isVerified) {
        upsertEcpayOrder({
          merchantTradeNo,
          browserReturnResult: result,
          browserCallbackVerified: true,
          browserReturnedAt: new Date().toISOString(),
        })
      } else {
        console.warn('[ECPay OrderResultURL] CheckMacValue 驗證失敗', merchantTradeNo)
      }

      const bookingIdParam = order?.bookingId ? `&bookingId=${order.bookingId}` : ''
      const isLikelySuccess = String(result.RtnCode || '') === '1' && String(result.SimulatePaid || '0') !== '1'
      const target = isLikelySuccess ? '/booking/payment/success' : '/booking/payment/failed'

      sendRedirect(
        response,
        `${appConfig.frontendBaseUrl}/#${target}?merchantTradeNo=${merchantTradeNo}${bookingIdParam}`,
      )
      return
    }

    if (request.method === 'POST' && isApiRoute(pathname, '/api/ecpay/return')) {
      const rawBody = await collectBody(request)
      const result = parseRequestBody(rawBody, request.headers['content-type'] || '')
      const merchantTradeNo = result.MerchantTradeNo || 'unknown'
      const isVerified = verifyCheckMacValue(result)
      const order = readEcpayOrder(merchantTradeNo)
      if (!isVerified || !order || String(result.MerchantID) !== appConfig.merchantId || Number(result.TradeAmt) !== Number(order.depositAmount)) {
        sendText(response, 400, '0|Invalid callback')
        return
      }

      if (isVerified) {
        upsertEcpayOrder({
          merchantTradeNo,
          returnNotifyResult: result,
          returnCallbackVerified: true,
          returnNotifiedAt: new Date().toISOString(),
        })
      } else {
        console.warn('[ECPay ReturnURL] CheckMacValue 驗證失敗', merchantTradeNo)
      }

      sendText(response, 200, '1|OK')
      return
    }

    if (request.method === 'POST' && isApiRoute(pathname, '/api/ecpay/query')) {
      const rawBody = await collectBody(request)
      const body = parseRequestBody(rawBody, request.headers['content-type'] || '')
      const merchantTradeNo = body.merchantTradeNo

      if (!merchantTradeNo) {
        sendJson(response, 400, { success: false, message: '缺少 merchantTradeNo' })
        return
      }

      const order = readEcpayOrder(merchantTradeNo)
      if (!order) {
        sendJson(response, 404, { success: false, message: '找不到這筆訂金交易' })
        return
      }

      let tradeInfo
      try {
        tradeInfo = await queryTradeInfo(merchantTradeNo)
      } catch (queryError) {
        console.error('[ECPay QueryTradeInfo] 查詢失敗', queryError)
        sendJson(response, 502, {
          success: false,
          message: '目前無法向綠界查詢付款結果，請稍後再試一次。',
        })
        return
      }

      const outcome = order.paymentStatus === 'paid' ? 'paid' : determinePaymentOutcome(tradeInfo, order)

      const updatedOrder = upsertEcpayOrder({
        merchantTradeNo,
        queryResult: tradeInfo,
        paymentStatus: outcome,
        lastQueriedAt: new Date().toISOString(),
      })

      let booking = order.bookingId ? readBooking(order.bookingId) : null

      if (booking && outcome === 'paid' && booking.paymentStatus !== 'paid') {
        booking = updateBooking(booking.bookingId, {
          paymentStatus: 'paid',
          bookingStatus: 'deposit_paid',
          ecpayTradeNo: tradeInfo.tradeNo || booking.ecpayTradeNo,
        })
      } else if (booking && outcome === 'failed' && booking.paymentStatus !== 'paid') {
        booking = updateBooking(booking.bookingId, {
          paymentStatus: 'failed',
          bookingStatus: 'deposit_payment_failed',
        })
      }

      sendJson(response, 200, {
        success: true,
        data: {
          merchantTradeNo,
          bookingId: order.bookingId,
          bookingStatus: booking?.bookingStatus || null,
          serviceType: booking?.serviceType ?? null,
          paymentStatus: updatedOrder.paymentStatus,
          confirmedServiceTotal: booking?.confirmedServiceTotal ?? null,
          depositAmount: booking?.depositAmount ?? order.depositAmount ?? null,
          balanceAmount: booking?.balanceAmount ?? null,
          tradeStatus: tradeInfo.tradeStatus,
          tradeMessage: tradeInfo.rtnMsg,
          updatedAt: updatedOrder.updatedAt,
        },
      })
      return
    }

    const orderLookupMatch = pathname.match(/^\/api\/ecpay\/orders\/([^/]+)$/)
    if (request.method === 'GET' && orderLookupMatch) {
      const merchantTradeNo = orderLookupMatch[1]
      const order = readEcpayOrder(merchantTradeNo)

      if (!order) {
        sendJson(response, 404, { success: false, message: '找不到這筆訂金交易' })
        return
      }

      const booking = order.bookingId ? readBooking(order.bookingId) : null

      sendJson(response, 200, {
        success: true,
        data: {
          merchantTradeNo,
          bookingId: order.bookingId,
          bookingStatus: booking?.bookingStatus || null,
          serviceType: booking?.serviceType ?? null,
          paymentStatus: order.paymentStatus,
          confirmedServiceTotal: booking?.confirmedServiceTotal ?? null,
          depositAmount: booking?.depositAmount ?? order.depositAmount ?? null,
          balanceAmount: booking?.balanceAmount ?? null,
          updatedAt: order.updatedAt,
        },
      })
      return
    }

    if (request.method === 'POST' && isApiRoute(pathname, '/api/line/webhook')) {
      const rawBody = await collectBody(request)
      const signature = request.headers['x-line-signature'] || ''

      if (!verifyLineSignature(rawBody, signature)) {
        console.warn('[LINE Webhook] 簽章驗證失敗，可能是 LINE_CHANNEL_SECRET 尚未設定或請求偽造')
        sendJson(response, 401, { success: false, message: '簽章驗證失敗' })
        return
      }

      const body = parseRequestBody(rawBody, 'application/json')
      const events = Array.isArray(body.events) ? body.events : []

      for (const event of events) {
        if (event.type === 'message' && event.message?.type === 'text' && event.replyToken) {
          const replyText = buildReplyText(event.message.text)
          await replyToLine(event.replyToken, replyText)
        }
      }

      sendJson(response, 200, { success: true })
      return
    }

    sendJson(response, 404, { success: false, message: '找不到 API 路由' })
  } catch (error) {
    sendJson(response, 500, {
      success: false,
      message: error instanceof Error ? error.message : '伺服器發生未知錯誤',
    })
  }
})

server.listen(appConfig.port, () => {
  console.log(`玄機堂擇日舘 API server 已啟動：http://localhost:${appConfig.port}`)
})
