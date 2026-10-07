import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import net from 'node:net'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { fileURLToPath } from 'node:url'
import { generateCheckMacValue } from '../server/ecpay.js'

const serverFile = fileURLToPath(new URL('../server/index.js', import.meta.url))
test('獨立 API 整合：驗證、訂金、簽章、模擬通知與回站', async t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'week05-api-test-'))
  const allocator = net.createServer().listen(0, '127.0.0.1')
  await once(allocator, 'listening')
  const port = allocator.address().port
  await new Promise(resolve => allocator.close(resolve))
  const base = `http://127.0.0.1:${port}`
  const child = spawn(process.execPath, [serverFile], { cwd: temp, env: { ...process.env, PORT:String(port), APP_BASE_URL:base, FRONTEND_BASE_URL:'https://50819just.github.io/xuanjitang-vibe-week05', ECPAY_ENV:'stage', DEMO_CONFIRM_ENABLED:'true' }, stdio:['ignore','pipe','pipe'] })
  let logs = ''
  child.stdout.on('data', chunk => { logs += chunk })
  child.stderr.on('data', chunk => { logs += chunk })
  t.after(async () => { child.kill(); if (child.exitCode === null) await once(child, 'exit'); fs.rmSync(temp, { recursive:true, force:true }) })
  for (let i=0; i<100; i++) { if (logs.includes('已啟動')) break; if (child.exitCode !== null) throw Error(logs); await new Promise(resolve => setTimeout(resolve,30)) }
  const request = async (route, body, headers={}) => {
    const response = await fetch(base + route, { method: body === undefined ? 'GET' : 'POST', headers:{'Content-Type':'application/json', ...headers}, ...(body===undefined?{}:{body:JSON.stringify(body)}) })
    return { status: response.status, data: await response.json() }
  }
  assert.equal((await request('/api/health')).data.environment, 'stage')
  assert.equal((await request('/api/health', undefined, {Origin:'https://evil.example'})).status, 403)
  assert.equal((await request('/api/bookings', null)).status,400)
  const payload={serviceType:'marriage',needSummary:'測試預約，不成立真實服務',desiredPeriod:'2026年11月',contactName:'測試甲',contactPhone:'0900000000',region:'虛構地區',contactPreference:'phone',consent:true}
  for (const bad of [{...payload,serviceType:'unknown'},{...payload,contactName:''},{...payload,consent:false},{...payload,needSummary:'x'.repeat(2001)}]) assert.equal((await request('/api/bookings',bad)).status,400)
  const created = await request('/api/bookings',payload)
  assert.equal(created.status,200)
  const id=created.data.data.bookingId
  assert.equal((await request(`/api/bookings/${id}/deposit-order`,{})).status,409)
  assert.equal((await request(`/api/bookings/${id}/demo-confirm`,{confirmedServiceTotal:799})).status,400)
  for (const [total,deposit] of [[5000,800],[8000,1200],[9000,1600]]) {
    const confirm=await request(`/api/bookings/${id}/demo-confirm`,{confirmedServiceTotal:total})
    assert.equal(confirm.data.data.depositAmount,deposit)
    assert.equal(confirm.data.data.balanceAmount,total-deposit)
  }
  await request(`/api/bookings/${id}/demo-confirm`,{confirmedServiceTotal:5000})
  const checkout=await request(`/api/bookings/${id}/deposit-order`,{})
  assert.equal(checkout.data.action,'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5')
  assert(checkout.data.fields.ReturnURL.startsWith(base))
  assert(checkout.data.fields.ClientBackURL.includes('/#/booking/payment/failed'))
  const merchantTradeNo=checkout.data.merchantTradeNo
  const notify=async fields => fetch(base+'/api/ecpay/return',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fields)})
  const fields={MerchantID:'3002607',MerchantTradeNo:merchantTradeNo,TradeAmt:'800',RtnCode:'1',SimulatePaid:'1'}
  assert.equal((await notify({...fields,CheckMacValue:'INVALID'})).status,400)
  const signed={...fields,CheckMacValue:generateCheckMacValue(fields)}
  assert.equal(await (await notify(signed)).text(),'1|OK')
  assert.notEqual((await request(`/api/bookings/${id}`)).data.data.paymentStatus,'paid')
  const wrong={...fields,TradeAmt:'1600'}
  assert.equal((await notify({...wrong,CheckMacValue:generateCheckMacValue(wrong)})).status,400)
  const result=await fetch(base+'/api/ecpay/order-result',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(signed),redirect:'manual'})
  assert.equal(result.status,303)
  assert(result.headers.get('location').includes('/#/booking/payment/failed?'))
  assert.equal((await request('/api/ecpay/query',{merchantTradeNo:'UNKNOWN'})).status,404)
})
