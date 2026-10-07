import crypto from 'node:crypto'
import { appConfig } from './config.js'

const ECPAY_ENDPOINTS = {
  stage: {
    checkout: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
    query: 'https://payment-stage.ecpay.com.tw/Cashier/QueryTradeInfo/V2',
  },
}

export const DEPOSIT_TIER_AMOUNTS = [800, 1200, 1600]

export function resolveDepositAmount(serviceTotalAmount) {
  const amount = Number(serviceTotalAmount)

  if (!Number.isSafeInteger(amount) || amount < 800) {
    return null
  }

  if (amount <= 5000) {
    return 800
  }

  if (amount <= 8000) {
    return 1200
  }

  return 1600
}

function toDotNetUrlEncode(value) {
  return encodeURIComponent(value)
    .toLowerCase()
    .replace(/%20/g, '+')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
}

function timingSafeEqual(leftValue, rightValue) {
  const leftBuffer = Buffer.from(String(leftValue || ''))
  const rightBuffer = Buffer.from(String(rightValue || ''))

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

export function generateCheckMacValue(parameters) {
  const sortedParameters = Object.entries(parameters)
    .filter(([, value]) => value !== undefined && value !== null)
    .filter(([key]) => key !== 'CheckMacValue')
    .sort(([keyA], [keyB]) => keyA.toLowerCase() < keyB.toLowerCase() ? -1 : keyA.toLowerCase() > keyB.toLowerCase() ? 1 : 0)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const rawValue = `HashKey=${appConfig.hashKey}&${sortedParameters}&HashIV=${appConfig.hashIv}`
  const encodedValue = toDotNetUrlEncode(rawValue)

  return crypto.createHash('sha256').update(encodedValue).digest('hex').toUpperCase()
}

export function verifyCheckMacValue(parameters) {
  const receivedValue = String(parameters.CheckMacValue || '').toUpperCase()

  if (!receivedValue) {
    return false
  }

  const computedValue = generateCheckMacValue(parameters)
  return timingSafeEqual(computedValue, receivedValue)
}

export function buildMerchantTradeNo() {
  const timestamp = Date.now().toString().slice(-10)
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase()

  return `XJ${timestamp}${randomPart}`.slice(0, 20)
}

export function formatTradeDate(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]))
  return `${parts.year}/${parts.month}/${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`
}

export function sanitizeItemText(value, fallbackValue) {
  return (value || fallbackValue).replace(/[^一-龥\w\s#-]/g, '').trim() || fallbackValue
}

export function createDepositCheckoutPayload({ bookingId, depositAmount }) {
  const merchantTradeNo = buildMerchantTradeNo()
  const itemName = sanitizeItemText('玄機堂擇日舘預約訂金', '玄機堂擇日舘預約訂金').slice(0, 200)
  const tradeDescription = sanitizeItemText('XuanJiTangDeposit', 'XuanJiTangDeposit')

  const fields = {
    MerchantID: appConfig.merchantId,
    MerchantTradeNo: merchantTradeNo,
    MerchantTradeDate: formatTradeDate(),
    PaymentType: 'aio',
    TotalAmount: depositAmount,
    TradeDesc: tradeDescription,
    ItemName: itemName,
    ReturnURL: `${appConfig.appBaseUrl}/api/ecpay/return`,
    OrderResultURL: `${appConfig.appBaseUrl}/api/ecpay/order-result`,
    ClientBackURL: `${appConfig.frontendBaseUrl}/#/booking/payment/failed`,
    ChoosePayment: 'Credit',
    EncryptType: 1,
    CustomField1: 'Week05Stage',
    CustomField2: bookingId,
  }

  return {
    merchantTradeNo,
    bookingId,
    action: ECPAY_ENDPOINTS[appConfig.ecpayEnv]?.checkout || ECPAY_ENDPOINTS.stage.checkout,
    fields: {
      ...fields,
      CheckMacValue: generateCheckMacValue(fields),
    },
  }
}

export async function queryTradeInfo(merchantTradeNo) {
  const payload = {
    MerchantID: appConfig.merchantId,
    MerchantTradeNo: merchantTradeNo,
    TimeStamp: Math.floor(Date.now() / 1000),
  }

  const requestBody = new URLSearchParams({
    ...payload,
    CheckMacValue: generateCheckMacValue(payload),
  })

  const endpoint = ECPAY_ENDPOINTS[appConfig.ecpayEnv]?.query || ECPAY_ENDPOINTS.stage.query
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: requestBody,
    signal: AbortSignal.timeout(15000),
  })

  const raw = await response.text()
  const parsed = Object.fromEntries(new URLSearchParams(raw))

  if (!response.ok || !verifyCheckMacValue(parsed) || String(parsed.MerchantID) !== appConfig.merchantId || parsed.MerchantTradeNo !== merchantTradeNo) {
    throw new Error('綠界查單回應驗證失敗，不能判定付款成功。')
  }

  return {
    ok: response.ok,
    raw,
    parsed,
    tradeStatus: String(parsed.TradeStatus || ''),
    paymentType: parsed.PaymentType || '',
    paymentDate: parsed.PaymentDate || '',
    tradeNo: parsed.TradeNo || '',
    tradeAmt: parsed.TradeAmt || '',
    rtnMsg: parsed.TradeMessage || parsed.RtnMsg || '',
    merchantTradeNo,
  }
}
