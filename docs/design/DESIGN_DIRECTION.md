> 保留的視覺設計參考；功能及驗收以根目錄 SPEC.md 為準。

# DESIGN_DIRECTION.md

狀態：Superseded for implementation（視覺實作以 DESIGN_SPEC.md 為準）  
最後更新：2026-08-13

## 文件目的

本文件用於定義玄機堂擇日舘網站第一版的視覺方向、品牌氣質與設計原則，作為後續設計稿、元件風格與前端實作的一致依據。

## 視覺關鍵字

- 穩重
- 安心
- 清楚
- 留白
- 文化感
- 優雅
- 不玄虛

## 品牌／氣質方向

整體氣質應偏向：
- 傳統文化感，但不要陳舊
- 專業可信，但不要距離感太重
- 溫和沉穩，但不要過度神祕
- 有質感，但不要華麗到壓迫閱讀

## 版面原則

- 以清楚分區與良好閱讀節奏為優先。
- 首頁需快速傳達品牌定位與主要服務。
- 重要資訊如服務、價格、流程與 CTA 要明顯可見。
- 避免過多裝飾導致資訊難讀。

## Product UX Architecture

- 首頁資訊主線：`Understand → Service → Trust → Process → Price → FAQ → Action`。
- 介面需要讓使用者快速回答：玄機堂做什麼、我屬於哪個服務、為何可信、怎麼處理／收費、如何開始。
- 首頁服務採分層視覺權重，不做七張完全等權卡片：主要人生事件、專業／在地服務、其他承接入口。
- Service Detail 使用共用 Template + Conditional Sections。
- Pricing 使用 Pricing Cards + Pricing Rules；Table 只作桌機次要比較。
- Booking 使用 4 個可見步驟，Desktop／Mobile 共用同一套流程邏輯。

## UI Foundation 的非阻塞項目

- 正式價格、老師真實年資、最終交付格式、完成天數與營運數字，均為可替換內容，不阻塞 Home、Service Detail Template、Booking 或 Pricing 的版型與互動結構。
- Booking 最後一步必須預留 Data Usage Notice、Privacy / Data Notice Link、Required Consent Checkbox 與 Privacy Contact Entry Point；不需先在 UI 中自行撰寫完整法律條款。

## 色彩方向

建議色彩方向：
- 主色偏沉穩、內斂的暖色或中性色。
- 輔助色可帶一點東方文化感，但避免過於強烈的飽和紅金搭配。
- 重點色用於 CTA、關鍵標示與資訊層級。

具體色碼已於 `DESIGN_SPEC.md` 固定；本文件僅保留方向說明。

## 字體方向

- 以繁體中文閱讀舒適度為優先。
- 標題可略帶文化氣質，但仍需清楚可讀。
- 內文需維持高可讀性與穩定排版。

字體已於 `DESIGN_SPEC.md` 固定為 Noto Serif TC 標題、Noto Sans TC 內文。

## 元件風格

- 卡片、按鈕、表單等元件應保持簡潔一致。
- 表單風格需清楚、乾淨、好填寫。
- FAQ、流程步驟、服務卡片可透過一致的框線、留白與層級建立秩序感。

### Stitch Foundation Batch
- Home：建立 Header、Hero、Service Card、Trust、Process、Pricing Preview、FAQ、CTA、Footer。
- Service Detail：先以婚嫁擇日驗證共用模板。
- Booking：驗證 4-Step、條件欄位、Review 與 Submitted State。
- Pricing：驗證參考價、價格區間、個案報價與特殊報價規則。
- Services Listing → About → FAQ / Contact 依序延伸。
- 另需驗證 Home Mobile 與 Booking Mobile。

## 圖像與裝飾方向

- 可使用低干擾的東方文化元素作為點綴。
- 避免大量符咒感、玄學感過重的視覺符號。
- 若使用人物或品牌照片，應以穩定、真誠、可信的形象為主。
- Trust 素材優先使用可公開的真實招牌、工作環境、工具或實物局部；日課／命狀局部需先遮蔽客戶個資。
- 真實信任證據不得以 AI 假造；Demo 示意人物／示範個案可依 `DEMO_VISUAL_ASSET_SPEC.md` 產出，但必須清楚標示為示意。

## RWD 原則

- 手機版優先確保導覽、服務資訊與預約 CTA 清楚可用。
- 表單在手機版需易於填寫，不應過長難捲動。
- FAQ 與價格資訊在小螢幕上需維持閱讀節奏。
- Booking 最後一步需有清楚的資料使用說明入口、必勾 Checkbox 與隱私聯絡入口；不需要在設計稿塞入未確認的完整法律條款。

## 參考案例

- 明安堂：僅作傳統文化氣質、服務分類與信任感的 Research Reference，不直接 Copy。
- 其他競品研究：保留在 `docs/research/COMPETITOR_NOTES.md`。

## 開放問題

- 品牌想更偏傳統典雅，還是偏現代簡約？
- 是否已有既定品牌色或 logo？
- 是否有可參考的風格網站或視覺偏好？
