export const DEPOSIT_TIER_RULES = [
  { label: '服務總價 NT$5,000 以下', depositAmount: 800 },
  { label: '服務總價 NT$5,001～8,000', depositAmount: 1200 },
  { label: '服務總價 NT$8,001 以上', depositAmount: 1600 },
]

export const DEPOSIT_EXAMPLE = {
  serviceTotalAmount: 5000,
  depositAmount: 800,
  balanceAmount: 4200,
}

/**
 * 前端顯示用參考邏輯；正式訂金金額一律以後端計算結果為準，
 * 不得由前端自行決定實際收取金額。
 */
export function resolveDepositAmount(serviceTotalAmount) {
  const amount = Number(serviceTotalAmount)

  if (!Number.isInteger(amount) || amount <= 0) {
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

export function computeBalanceAmount(serviceTotalAmount, depositAmount) {
  return Number(serviceTotalAmount) - Number(depositAmount)
}
