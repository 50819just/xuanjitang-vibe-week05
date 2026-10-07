import fs from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {}
  }

  const content = fs.readFileSync(filePath, 'utf8')

  return content.split('\n').reduce((env, line) => {
    const trimmedLine = line.trim()

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return env
    }

    const separatorIndex = trimmedLine.indexOf('=')

    if (separatorIndex === -1) {
      return env
    }

    const key = trimmedLine.slice(0, separatorIndex).trim()
    const value = trimmedLine.slice(separatorIndex + 1).trim()

    env[key] = value
    return env
  }, {})
}

const fileEnv = parseEnvFile(path.join(rootDir, '.env'))

function getConfigValue(key, fallbackValue) {
  return process.env[key] || fileEnv[key] || fallbackValue
}

const frontendBaseUrl = getConfigValue('FRONTEND_BASE_URL', 'http://localhost:5175')

function resolveOrigin(url) {
  try {
    return new URL(url).origin
  } catch {
    return url
  }
}

// 以下 MerchantID / HashKey / HashIV 預設值為綠界官方公開的測試環境帳密，
// 僅供 stage 測試使用，不是正式金鑰；此專案禁止切換正式金流。
export const appConfig = {
  port: Number(getConfigValue('PORT', 3005)),
  appBaseUrl: getConfigValue('APP_BASE_URL', getConfigValue('RENDER_EXTERNAL_URL', 'http://localhost:3005')),
  // frontendBaseUrl 可能含部署子路徑（例如 GitHub Pages 專案頁），用於組合使用者會看到的連結；
  // frontendOrigin 只有 scheme+host+port，CORS 標頭一定要用這個，含路徑會讓瀏覽器判定不合法而擋掉請求。
  frontendBaseUrl,
  frontendOrigin: resolveOrigin(frontendBaseUrl),
  ecpayEnv: getConfigValue('ECPAY_ENV', 'stage'),
  merchantId: getConfigValue('ECPAY_MERCHANT_ID', '3002607'),
  hashKey: getConfigValue('ECPAY_HASH_KEY', 'pwFHCqoQZGmho4w6'),
  hashIv: getConfigValue('ECPAY_HASH_IV', 'EkRm7iFT261dpevs'),
  // 獨立開關，不看 NODE_ENV：Render 等平台的 Node 服務常會自動把 NODE_ENV 設成
  // production，若沿用 NODE_ENV 判斷會在部署後被意外關掉，導致 Demo 老師確認功能整個消失。
  // 之後真的要停用 Demo 工具時，改設 DEMO_CONFIRM_ENABLED=false 即可。
  isDemoConfirmEnabled: getConfigValue('DEMO_CONFIRM_ENABLED', 'true') !== 'false',
  lineChannelSecret: getConfigValue('LINE_CHANNEL_SECRET', ''),
  lineChannelAccessToken: getConfigValue('LINE_CHANNEL_ACCESS_TOKEN', ''),
}

if (appConfig.ecpayEnv !== 'stage') {
  throw new Error('此專案僅允許 ECPAY_ENV=stage，禁止正式收款。')
}
