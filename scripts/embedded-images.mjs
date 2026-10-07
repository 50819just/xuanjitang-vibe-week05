import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)])
}

export function embeddedImages() {
  return {
    name: 'week05-embedded-images',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const source = walk('src').filter(file => /\.(jsx?|css)$/.test(file)).map(file => fs.readFileSync(file, 'utf8')).join('\n')
        const assets = new Set([...source.matchAll(/assetUrl\(['"](branding\/[^'"]+)['"]\)/g)].map(match => match[1]))
        const botanical = fs.readFileSync('src/components/ui/BotanicalCorners.jsx', 'utf8')
        for (const match of botanical.matchAll(/: '([^']+\.(?:jpg|png))'/g)) assets.add(`branding/banners/site/${match[1]}`)
        const map = {}
        for (const asset of assets) {
          const buffer = await sharp(path.join('public', asset)).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 100 }).toBuffer()
          map[asset] = `data:image/webp;base64,${buffer.toString('base64')}`
        }
        return html.replace('</head>', `<script>globalThis.__WEEK05_ASSETS__=${JSON.stringify(map).replace(/</g, '\\u003c')}</script></head>`)
      },
    },
  }
}
