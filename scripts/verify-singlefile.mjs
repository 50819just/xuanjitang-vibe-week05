import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'

const file = path.resolve('dist/index.html')
let html = fs.readFileSync(file, 'utf8')
html = html.replace(/<script\b([^>]*?)src=["']([^"']+)["']([^>]*)><\/script>/gi, (_, before, source) => {
  assert(!source.includes('..') && !source.startsWith('http'), '只可內嵌 dist 內的程式')
  const script = fs.readFileSync(path.join('dist', source.replace(/^\.\//, '')), 'utf8').replace(/<\/script/gi, '<\\/script')
  return `<script type="module">${script}</script>`
})
html = html.replace(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi, (tag, source) => {
  if (!tag.includes('stylesheet')) return tag.includes('modulepreload') ? '' : tag
  assert(!source.includes('..') && !source.startsWith('http'), '只可內嵌 dist 內的樣式')
  return `<style>${fs.readFileSync(path.join('dist', source.replace(/^\.\//, '')), 'utf8')}</style>`
})

assert(!/<script[^>]+src=/i.test(html), '單檔不得引用外部 JS')
assert(!/<link[^>]+rel=["']stylesheet/i.test(html), '單檔不得引用外部 CSS')
assert(!/\b(?:import|export)\s[^;]+from\s*["']/i.test(html), '不得含未打包模組')
assert(html.includes('globalThis.__WEEK05_ASSETS__='), '必須內嵌圖片')
for (const match of html.matchAll(/url\(\s*["']?([^)'"]+)/gi)) assert(match[1].startsWith('data:') || match[1].startsWith('#') || match[1].startsWith('%23'), '不得含外部或相對路徑字型 / CSS 圖片：' + match[1].slice(0,100))
assert(!html.includes('material-symbols.ttf'), 'SVG版本不應再依賴圖示字型')
assert(html.includes('payment-stage.ecpay.com.tw'), '必須限制綠界測試環境')
const fontLicense = fs.readFileSync('public/fonts/LICENSE.txt', 'utf8').replace(/<\/script/gi, '<\\/script')
html = html.replace('</body>', `<script type="text/plain" id="material-symbols-license">Material Symbols SVG outlines by Google (derived from official font subset)\nSource: https://github.com/google/material-design-icons\n${fontLicense}</script></body>`)
fs.writeFileSync(file, html)
fs.mkdirSync('submission', { recursive: true })
fs.writeFileSync('submission/index.html', html)

// 驗證全部通過才覆寫交付成品，避免失敗建置留下錯誤交付檔。
// Vite public 靜態副本不需隨單一檔案公開。
for (const entry of fs.readdirSync('dist')) if (entry !== 'index.html') fs.rmSync(path.join('dist', entry), { recursive: true, force: true })
console.log(`單檔 QA 通過：只有 index.html，${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MiB，JS/CSS/圖像/SVG圖示全部內嵌。`)
