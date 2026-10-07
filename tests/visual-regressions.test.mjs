import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { ICON_PATHS } from '../src/components/ui/iconPaths.js'
import { services } from '../src/data/services.js'
import { principleStrip, trustPrinciples } from '../src/data/siteContent.js'

test('首頁與服務圖示全部具有SVG路徑，不依賴字型連字', () => {
  const names = [...services, ...principleStrip, ...trustPrinciples].map(item => item.icon)
  for (const name of [...names, 'menu', 'close', 'arrow_forward', 'arrow_back', 'expand_more', 'check_circle', 'done', 'info', 'refresh', 'error', 'linear_scale', 'check']) {
    assert.match(ICON_PATHS[name], /^M/, name)
  }
  const styles = fs.readFileSync('src/styles.css', 'utf8')
  assert(!styles.includes('material-symbols.ttf'))
  for (const file of fs.readdirSync('src/pages')) {
    if (file.endsWith('.jsx')) assert(!fs.readFileSync(`src/pages/${file}`, 'utf8').includes('material-symbols-outlined'), file)
  }
})

test('固定導覽預留實際高度，不使用固定80px假設', () => {
  const header = fs.readFileSync('src/components/layout/Header.jsx', 'utf8')
  const shell = fs.readFileSync('src/components/layout/PageShell.jsx', 'utf8')
  assert(header.includes('ResizeObserver'))
  assert(header.includes('getBoundingClientRect().height'))
  assert(shell.includes('site-shell'))
  assert(fs.readFileSync('src/styles.css', 'utf8').includes('padding-top: var(--site-header-height'))
  assert(!shell.includes('mt-20'))
})


test('手機導覽使用正常排版流，固定導覽僅限桌機', () => {
  const header = fs.readFileSync('src/components/layout/Header.jsx', 'utf8')
  assert(header.includes('relative lg:fixed'))
  assert(header.includes('bg-paper text-ink lg:bg-ink/50'))
})

test('必填錯誤顯示在欄位前，聚焦並捲入可視區域', () => {
  const booking = fs.readFileSync('src/pages/BookingPage.jsx', 'utf8')
  assert(booking.indexOf('role="alert"') < booking.indexOf('stepRenderers[currentStepKey]()'))
  assert(booking.includes('focus({ preventScroll: true })'))
  assert(booking.includes("scrollIntoView({ block: 'start'"))
  assert(booking.includes('[stepError, validationAttempt]'))
  assert(booking.includes('flex flex-wrap justify-between'))
})
