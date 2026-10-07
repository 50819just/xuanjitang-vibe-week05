export function submitEcpayCheckoutForm(action, fields) {
  if (action !== 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5') {
    throw new Error('此作業僅允許綠界測試環境付款。')
  }
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = action

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = String(value)
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}
