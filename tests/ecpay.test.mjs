import test from 'node:test'
import assert from 'node:assert/strict'
import { generateCheckMacValue, verifyCheckMacValue, resolveDepositAmount, createDepositCheckoutPayload } from '../server/ecpay.js'

test('符合綠界官方 SHA256 範例', () => {
  const sample = { TradeDesc:'促銷方案', PaymentType:'aio', MerchantTradeDate:'2023/03/12 15:30:23', MerchantTradeNo:'ecpay20230312153023', MerchantID:'3002607', ReturnURL:'https://www.ecpay.com.tw/receive.php', ItemName:'Apple iphone 15', TotalAmount:30000, ChoosePayment:'ALL', EncryptType:1 }
  assert.equal(generateCheckMacValue(sample), '6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840')
})
test('簽章保留空欄位並拒絕竄改金額', () => {
  const sample = { MerchantID:'3002607', CustomField1:'', TotalAmount:800 }
  const signed = { ...sample, CheckMacValue:generateCheckMacValue(sample) }
  assert.equal(verifyCheckMacValue(signed), true)
  assert.equal(verifyCheckMacValue({ ...signed, TotalAmount:1600 }), false)
  assert.notEqual(generateCheckMacValue(sample), generateCheckMacValue({ MerchantID:'3002607', TotalAmount:800 }))
})
test('測試訂金級距與不足金額防護', () => {
  assert.equal(resolveDepositAmount(5000),800)
  assert.equal(resolveDepositAmount(8000),1200)
  assert.equal(resolveDepositAmount(9000),1600)
  for (const value of [0, -1, 799, 100.5, 'NaN']) assert.equal(resolveDepositAmount(value),null)
})
test('僅建立綠界 stage checkout，且不傳姓名', () => {
  const result = createDepositCheckoutPayload({ bookingId:'BKTEST', depositAmount:800, customerName:'測試姓名' })
  assert.equal(result.action,'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5')
  assert.equal(result.fields.CustomField1,'Week05Stage')
  assert.equal(verifyCheckMacValue(result.fields),true)
})
