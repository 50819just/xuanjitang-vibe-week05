import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeRoute, parseHashRoute, routeHref } from '../src/lib/routes.js'
import { resolveDepositAmount } from '../src/data/pricingRules.js'

test('單檔 hash 導覽與 query 分離', () => {
  assert.deepEqual(parseHashRoute('#/booking?service=marriage'), { pathname: '/booking', search: '?service=marriage' })
  assert.equal(routeHref('/pricing'), '#/pricing')
  assert.deepEqual(parseHashRoute(''), { pathname: '/', search: '' })
})
test('登入後回站不接受外站或不合法路徑', () => {
  for (const value of ['https://example.com', '//example.com', '/\\example.com', '/bad\npath', null]) assert.equal(normalizeRoute(value), '/')
  assert.equal(normalizeRoute('/booking/submitted?bookingId=BKTEST'), '/booking/submitted?bookingId=BKTEST')
})
test('前端訂金規則與後端一致', () => {
  for (const [total, deposit] of [[800,800],[5000,800],[5001,1200],[8000,1200],[8001,1600]]) assert.equal(resolveDepositAmount(total), deposit)
  for (const total of [0,799,-1,800.5,'invalid']) assert.equal(resolveDepositAmount(total),null)
})
