> 保留的視覺設計參考；功能及驗收以根目錄 SPEC.md 為準。

# 玄機堂擇日舘 Design Spec

狀態：Implementation Foundation  
最後更新：2026-08-14  
設計依據：`SPEC.md`、`docs/design/STITCH_UI_PROMPT.md`、Stitch 正式 22 張畫面、現有 Logo 資產

## 1. 文件目的與優先順序

本文件定義 React 實作時的 UI 視覺、元件與互動準則，避免以舊版 Stitch 畫面或臨時直覺改動造成視覺與流程飄移。

優先順序：

1. `SPEC.md`：產品、付款、流程與內容邊界。
2. 本文件：視覺 token、元件與 RWD 行為。
3. `docs/design/STITCH_SCREEN_INVENTORY.md`：正式畫面對照。
4. 既有 React：僅作目前程式結構參考；若與前述規格衝突，以前述規格為準。

## 2. 視覺方向

- 關鍵字：現代台灣禮俗、暖白紙感、沉穩、清楚、留白、可信。
- 不做：金光、過度神祕、算命遊戲化、電商購物車、玻璃霓虹風。
- 標題使用文化感但保持易讀；正文使用高可讀的繁體中文無襯線字。
- 所有重要流程資訊以文字、層級和留白說清楚，不依賴裝飾圖像。

## 3. Design Token

### 3.1 色彩

| Token | 值 | 用途 |
| --- | --- | --- |
| `--color-primary` | `#9E4B3D` | 主要 CTA、目前頁面、重要強調 |
| `--color-primary-deep` | `#803428` | Hover、深色 CTA、Logo 深色關聯 |
| `--color-primary-soft` | `#FFD8D2` | CTA 淡底、提示區塊 |
| `--color-paper` | `#FFF8F4` | 全站主背景 |
| `--color-surface` | `#FCF2E9` | 卡片／次級區塊 |
| `--color-surface-strong` | `#F1E6DE` | 資訊摘要、強調容器 |
| `--color-ink` | `#1F1B16` | 標題、主要文字 |
| `--color-text-secondary` | `#55433F` | 說明文字 |
| `--color-line` | `#DAC1BC` | 邊框、分隔線 |
| `--color-success` | `#3F6D56` | 訂金付款成功狀態 |
| `--color-error` | `#BA1A1A` | 付款失敗、欄位錯誤 |

不得自行加入強飽和金色、螢光色或與現有 Design System 不一致的漸層。

### 3.2 字體

- 標題：`Noto Serif TC`，fallback `PMingLiU, serif`。
- 內文／表單／按鈕：`Noto Sans TC`，fallback `PingFang TC, Microsoft JhengHei, sans-serif`。
- 不混用英文字體作中文大標；英文或金額可沿用同一字族。

| Role | Desktop | Tablet | Mobile | Weight / line-height |
| --- | ---: | ---: | ---: | --- |
| Display / Hero H1 | 56–64px | 44–52px | 36–40px | 600 / 1.2 |
| Page H1 | 40–48px | 36–40px | 30–34px | 600 / 1.3 |
| Section H2 | 30–32px | 28–30px | 24–28px | 500–600 / 1.4 |
| Card H3 | 20–24px | 20–22px | 18–20px | 500 / 1.5 |
| Body | 16–18px | 16px | 16px | 400 / 1.7 |
| Label / eyebrow | 12–14px | 12–14px | 12px | 500 / 1.3 |

### 3.3 間距、容器與圓角

- 基準：8px spacing scale；細微間距可用 4px。
- Desktop content max-width：1280px；外側至少 64px。
- Tablet 外側：32px；Mobile 外側：20px。
- 大區塊垂直間距：Desktop 80px、Tablet 64px、Mobile 48px。
- 卡片內距：Desktop / Tablet 24–32px；Mobile 20–24px。
- 按鈕與輸入框圓角：8px；卡片：16px；大區塊：24px。
- 陰影極淡或不用重陰影，以紙面層次、細邊框和暖色 surface 區隔。

## 4. Logo

### 4.1 資產

| 情境 | 檔案 |
| --- | --- |
| 導覽列暖／淺背景 | `public/branding/logo-symbol-on-light.png` |
| 深色 footer 或深色底 | `public/branding/logo-symbol-on-dark.png` |
| 原始保存，不直接當 UI 色彩版 | `public/branding/logo-symbol-original.png` |

- 導覽列左側固定使用 `logo-symbol-on-light.png`，不可將黑色原始檔直接放在暖白導航上。
- Logo 不拉伸、不加投影、不改比例；需有可讀的品牌文字替代資訊。
- 深色版僅在真的使用深色背景時切換，不為了裝飾混用。

## 5. Navigation

### Desktop

- Sticky header，暖白半透明底、細邊框，避免擋住內容。
- 左：Logo；中：首頁／服務項目／價格說明／常見問題／聯絡我們；右：`開始預約`。
- `開始預約` 一律前往 `/booking` 或對應 Booking route，不導向付款頁。

### Tablet

- 保留 Logo 與主 CTA。
- 導覽可收為精簡連結或 hamburger，但必須可通往服務、價格、FAQ、聯絡與預約。

### Mobile

- Logo 左、menu button 右；展開選單採直向連結與全寬 `開始預約`。
- Menu 開啟時需有關閉方式、鍵盤焦點與背景捲動處理。

## 6. 共用元件

### 6.1 Buttons

| Variant | 用途 | 規則 |
| --- | --- | --- |
| Primary | 開始預約、下一步、送出預約申請、支付預約訂金 | 磚紅底、白字、最小高度 48px |
| Secondary | 了解服務、返回修改、返回首頁 | 紙色底、磚紅字、細框 |
| Text / Inline | FAQ、資料使用說明、服務條款 | 不偽裝成 CTA；有明確 hover / focus |
| Danger / Retry | 重新支付預約訂金 | 不用紅色危險樣式；仍是主要操作，但文案要清楚 |

- Hover：僅色彩加深或 1px 上移；不可大幅縮放。
- Focus visible：至少 2px `--color-primary` focus ring。
- Disabled：降低對比但仍可辨識，不能只靠 opacity 讓文字看不見。
- Loading：保留按鈕寬度、停用重複送出，顯示處理中但不承諾完成時間。

### 6.2 Card

- 用於服務卡、價格規則、流程、付款摘要、狀態說明。
- 結構：標題 → 簡短說明 → 必要資訊／CTA；不可塞入未確認的真實案例或評價。
- 服務卡可預選帶入 `/booking`，但使用者在 Booking Step 1 必須可修改。

### 6.3 Form

- Label 永遠可見，placeholder 不取代 label。
- 必填欄位以文字與程式驗證呈現；錯誤訊息放在欄位旁／下方。
- 電話、LINE、地址、老師資料一律只渲染 `SPEC.md` 已確認內容或 `<...待補>` placeholder。
- Step 4 保留資料使用說明連結與 Required Consent Checkbox。

### 6.4 Status Panels

- Submitted：安靜確認 icon、`預約申請已送出`，不做彩帶或付款成功感。
- Deposit Paid：顯示服務總價、已付訂金、尾款與人工確認說明。
- Failed / Cancelled：明確寫 `付款未完成`，保留案件、可重新付款或聯繫老師；不得顯示預約成功。

## 7. 頁面與流程視覺規則

### 首頁

區塊主線固定：Hero → Service → Trust → Process → Price → FAQ → CTA。

- Hero 必須說明人工確認，不暗示網站自動產出擇日結果。
- 服務共七項，包含 `其他服務諮詢`；神明／祖先顯示 `NT$8,000 起` 時需同時附人工確認說明。

### 服務詳情

- 使用共用 Detail template：適合情境、服務方式、費用說明、注意事項、開始預約。
- 不補寫老師年資、傳承、案例或保證。

### 價格

- 不做商城或商品一次付清 UI。
- 需清楚說明：人工確認總價後，訂金級距只有 NT$800／1,200／1,600；尾款 = 總價 − 已付訂金。
- 外縣市、到場、多地點、特殊案件不自動計價。

### 預約

- 固定可見 4 Steps：
  1. 您的需求
  2. 服務相關資料
  3. 聯絡與到場
  4. 確認並送出
- 第一次送出只建立 Booking Request，不直接付款、不導向綠界。

### 付款

- 僅在老師確認服務內容、總價、日期／時間後出現付款入口。
- 付款按鈕使用 `支付預約訂金`，不可寫成全額付款或立即預約成功。
- 成功範例：總價 NT$5,000／訂金 NT$800／尾款 NT$4,200。

## 8. RWD

| Breakpoint | 目標寬度 | 行為 |
| --- | ---: | --- |
| Desktop | 1440px | 多欄資訊、完整導航、內容 max-width 1280px |
| Tablet | 1024px | 2 欄優先、導覽簡化、付款摘要與表單保持可讀 |
| Mobile | 375px | 單欄、sticky CTA 視需求使用、表單全寬、無水平捲動 |

- 不可只是縮小 Desktop；Mobile 需重新編排。
- Services：Desktop 3 欄、Tablet 2 欄、Mobile 1 欄。
- Booking Stepper：Desktop / Tablet 橫向可見；Mobile 使用可讀的縮排／水平進度呈現，仍清楚為 4 Steps。
- 表單欄位：Desktop / Tablet 可雙欄；Mobile 單欄。
- 每次 PR / 完成功能至少以 1440、1024、375 三尺寸截圖檢查 overflow、文字換行、按鈕觸控區與導覽。

## 9. Accessibility

- 文字與背景對比至少達 WCAG AA 的可讀標準。
- 所有互動元件可用鍵盤操作，有可見 focus。
- Icon button 必須有 accessible name；裝飾 Logo 可 `aria-hidden`，品牌 Logo 則需可讀 alt。
- 不以顏色單獨傳達成功、錯誤、必填或目前步驟。
- 動畫維持短暫、可減少；不使用造成暈眩的大幅移動。

## 10. Implementation Guardrails

- 不重新 Generate Stitch；只以 22 張正式畫面做 reference。
- Demo 視覺可以使用 AI 生成的示意人物與示範個案；但必須依 `docs/specs/DEMO_VISUAL_ASSET_SPEC.md` 標示，且不得偽裝成真實老師、店面、客戶、評價、傳承或服務證據。
- 不新增假地址、假電話、假 LINE、假付款規則或未確認聯絡資料。
- 綠界 MerchantID、HashKey、HashIV 僅能在後端環境變數，不出現在 React 或本文件範例。
- 實作前，所有現有 React 中與 `SPEC.md` 衝突的文案／資料需先盤點，再以 Confirmed、Proxy Assumption、Pending 分層處理。

## 11. Demo Visual Assets

- Demo 影像採「先完成元件與容器，再產對應比例素材，再立即放入 1440／1024／375 檢查」的節奏。
- 詳細素材類型、檔名、標示、alt text 與不可使用內容見 `docs/specs/DEMO_VISUAL_ASSET_SPEC.md`。
- 每張 Demo 人物或個案素材均須能在 UI 顯示或鄰近文案中辨識為示意，不以真實服務證據呈現。

## 12. Implementation Scope and Production Confirmations

### Demo UI 實作已確認

1. React 以 22 張已鎖定畫面為範圍；同一個畫面群組可由共用 route + responsive layout / state 實作，並不強制建立 22 個獨立 URL。
2. Mobile 導覽預設採可關閉的 drawer；若既有 Stitch reference 為展開式 menu，僅能在不改變資訊可達性的前提下調整。
3. 沒有真實影像時，可先用符合 Demo Visual Asset Spec 的示意人物與裝飾圖。

### 正式上線前仍須業主確認

1. 首頁與 Footer 要顯示的真實聯絡資料／是否只使用 placeholder。
2. React 中既有 `siteData.js` 的老師姓名、地址、電話、Email 是否皆可繼續公開使用；未確認前不得擴寫。
3. 真實服務、招牌、空間或工作實物圖片的公開授權與替換範圍。
