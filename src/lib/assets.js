/** 開發時使用 public 圖片，單檔建置時使用內嵌圖像。 */
export function assetUrl(path) {
  return globalThis.__WEEK05_ASSETS__?.[path] || `${import.meta.env?.BASE_URL ?? '/'}${path}`
}
