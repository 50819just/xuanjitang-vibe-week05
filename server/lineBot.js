import crypto from 'node:crypto'
import { appConfig } from './config.js'
import { services } from '../src/data/services.js'
import { brand, contact } from '../src/data/siteContent.js'

const LINE_REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply'

export function verifyLineSignature(rawBody, signatureHeader) {
  if (!appConfig.lineChannelSecret || !signatureHeader) {
    return false
  }

  const expected = crypto
    .createHmac('sha256', appConfig.lineChannelSecret)
    .update(rawBody)
    .digest('base64')

  const expectedBuffer = Buffer.from(expected)
  const receivedBuffer = Buffer.from(signatureHeader)

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

const WELCOME_TEXT =
  `您好，這裡是${brand.name}。\n${brand.description}\n\n` +
  '想開始預約，或想先了解服務項目、價格，都可以直接輸入關鍵字告訴我，例如「預約」「服務項目」「價格」「聯絡方式」。'

const BOOKING_TEXT =
  '想開始預約，請點下方連結填寫預約申請表單：\n' +
  `${appConfig.frontendBaseUrl}/booking\n\n` +
  '送出後不代表預約成功，老師會先人工確認服務內容、費用與時間，再透過 LINE 或電話與您聯繫。'

const SERVICES_TEXT =
  '目前提供的服務項目：\n' +
  services.map((service) => `・${service.title}`).join('\n') +
  `\n\n詳細內容可到網站查看：${appConfig.frontendBaseUrl}/`

const PRICING_TEXT =
  '各服務參考價格：\n' +
  services.map((service) => `・${service.title}：${service.pricingLabel}`).join('\n') +
  '\n\n實際費用由老師依案件內容人工確認後才收取預約訂金，不做自動計價。' +
  `\n完整說明：${appConfig.frontendBaseUrl}/pricing`

const CONTACT_TEXT =
  `${contact.teacherName}\n電話：${contact.phone}\nEmail：${contact.email}\n地址：${contact.address}\n\n${contact.note}`

const FALLBACK_TEXT =
  '目前這裡僅提供基本資訊查詢，無法自動判斷或安排您的需求。\n' +
  '想進一步申請，請直接輸入「預約」取得表單連結，老師會親自確認後與您聯繫。'

const KEYWORD_RULES = [
  { pattern: /預約|申請|booking/i, reply: BOOKING_TEXT },
  { pattern: /服務|項目/, reply: SERVICES_TEXT },
  { pattern: /價格|費用|多少錢|訂金/, reply: PRICING_TEXT },
  { pattern: /聯絡|電話|地址|email|信箱/i, reply: CONTACT_TEXT },
  { pattern: /你好|哈囉|嗨|hi|hello/i, reply: WELCOME_TEXT },
]

export function buildReplyText(userText) {
  const trimmed = String(userText || '').trim()

  if (!trimmed) {
    return FALLBACK_TEXT
  }

  const matchedRule = KEYWORD_RULES.find((rule) => rule.pattern.test(trimmed))
  return matchedRule ? matchedRule.reply : FALLBACK_TEXT
}

export async function replyToLine(replyToken, text) {
  if (!appConfig.lineChannelAccessToken) {
    console.warn('[LINE] 尚未設定 LINE_CHANNEL_ACCESS_TOKEN，略過回覆')
    return
  }

  await fetch(LINE_REPLY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${appConfig.lineChannelAccessToken}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: 'text', text }],
    }),
  })
}
