import fs from 'node:fs'
import path from 'node:path'

const dataDir = path.join(process.cwd(), 'server', 'data')

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

export function readJsonFile(fileName, fallbackValue) {
  ensureDataDir()
  const filePath = path.join(dataDir, fileName)

  if (!fs.existsSync(filePath)) {
    return fallbackValue
  }

  const content = fs.readFileSync(filePath, 'utf8')

  if (!content.trim()) {
    return fallbackValue
  }

  return JSON.parse(content)
}

export function writeJsonFile(fileName, data) {
  ensureDataDir()
  const filePath = path.join(dataDir, fileName)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}
