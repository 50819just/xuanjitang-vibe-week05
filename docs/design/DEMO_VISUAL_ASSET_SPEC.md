> 保留的視覺設計參考；功能及驗收以根目錄 SPEC.md 為準。

# Demo Visual Asset Spec

狀態：Confirmed for Demo Build  
最後更新：2026-08-14  
關聯文件：`docs/specs/DESIGN_SPEC.md`、`docs/requirements/CONTENT_REQUIREMENTS.md`、`docs/Spec.md`

## 1. 目的

在沒有完整真實品牌影像素材的 MVP Demo 階段，允許一邊建置 React 區塊、一邊產出風格一致的 AI 視覺素材；同時避免將示意素材誤解為玄機堂已驗證的老師、客戶、歷史、店面或服務證據。

素材風格參考「台灣傳統禮俗的檔案感、紙本與手作質地」，但不複製競品照片、牌匾、人物或傳承敘事。

## 2. 素材分類與前台標示

| 類型 | 可使用位置 | 必要標示 | 不可做 |
| --- | --- | --- | --- |
| Decorative editorial | Hero 背景、section side art、CTA／footer texture | 不需要逐張文字標示；alt 為裝飾用途 | 偽造成真實招牌、實體店面、歷史照片或證書 |
| Demo advisor portrait | About／Trust 的人物卡、服務說明側欄 | `示意人物` 或 `Demo 示意人物` | 使用真實老師姓名、年資、師承、證照或真人身分主張 |
| Demo case visual | 情境案例卡、服務流程說明 | `示範個案` 或 `情境示例` | 客戶好評、五星分數、引號推薦、真實服務完成證明 |
| Object / document still life | Service、Pricing、Booking 的情境視覺 | 必要時標 `情境示意` | 模擬玄機堂祖傳手稿、舊店章、真實牌匾、史料與日期 |

## 3. 統一藝術方向

### 視覺關鍵字

- Modern Taiwanese ritual editorial
- 暖白宣紙、茶褐木質、低飽和磚紅朱印
- 線裝書、空白紙卡、日期格線、微弱窗格陰影
- 安靜、乾淨、留白、可讀，不走強烈廟宇、金光或恐怖神祕風

### 色彩與光線

- 以 `#FFF8F4`、`#FCF2E9`、`#9E4B3D`、`#803428`、`#705A47` 為主要視覺範圍。
- 使用自然柔光、紙面紋理與低對比陰影。
- 禁止螢光、強金色、紫黑迷霧、神像主體、符咒滿版、誇張能量特效。

### 人物

- 人物外觀為虛構台灣成年人，不以任何真實人物為參考或命名。
- 姿勢採閱讀資料、整理紙本、諮詢交談等日常工作感；不做神通、施法、算命結果保證的畫面。
- UI 中需要在圖片附近或卡片 metadata 清楚出現 `示意人物`。

## 4. 第一批素材與檔名

所有生成檔放在 `public/demo/`，依類型分資料夾。檔名固定小寫 kebab-case，不覆寫 Logo 資產。

| Asset ID | 建議檔案 | 比例 | 首要用途 | 標示 |
| --- | --- | ---: | --- | --- |
| `hero-paper-ritual` | `public/demo/editorial/hero-paper-ritual.webp` | 3:2 | Home Hero 右側或底圖 | decorative |
| `service-book-calendar` | `public/demo/editorial/service-book-calendar.webp` | 4:3 | 服務詳情 | 情境示意（若伴隨主張） |
| `pricing-desk-still-life` | `public/demo/editorial/pricing-desk-still-life.webp` | 4:3 | 價格／流程 | decorative |
| `advisor-demo-01` | `public/demo/people/advisor-demo-01.webp` | 4:5 | About／Trust 人物卡 | 示意人物 |
| `case-marriage-demo` | `public/demo/cases/case-marriage-demo.webp` | 4:3 | 婚嫁情境卡 | 示範個案 |
| `case-moving-demo` | `public/demo/cases/case-moving-demo.webp` | 4:3 | 入宅／搬遷情境卡 | 示範個案 |

## 5. 生成與建置工作流

1. 先建立元件、圖片容器與 RWD aspect-ratio，不先塞臨時隨機圖片。
2. 依該容器的比例產圖；一個區塊一次只產一張主素材。
3. 儲存至對應的 `public/demo/` 路徑，使用 Asset ID 作為 React data key。
4. 在 1440／1024／375 檢查裁切、可讀性與圖片不搶走 CTA。
5. 補上正確 alt text 與必要 Demo 標示。
6. 素材確認後才產下一個區塊，避免風格漂移。

## 6. Prompt Guardrails

每次圖片生成 prompt 必須包含：

```text
Original fictional demo visual for Xuanjitang date-selection service website.
Modern Taiwanese ritual editorial aesthetic; warm rice-paper palette, muted vermilion accents, soft natural light, generous negative space.
Do not depict a real business, real teacher, real customer, real historical document, real certificate, real shop sign, review text, rating stars, readable contact details, or claims of spiritual outcomes.
```

人物／個案 prompt 另加：

```text
This is a fictional demo person / fictional scenario and must not imply a real client, teacher, testimonial, lineage, or completed service record.
```

## 7. Content and Accessibility Rules

- Decorative image：`alt=""` 並加 `aria-hidden="true"`。
- Informative demo image：alt 使用「示意人物：正在整理預約資料」或「示範個案：婚嫁日期安排情境」等描述，不把示意寫成事實。
- 圖片中的文字不可承擔必要資訊；服務規則、價格、訂金與流程一定以 HTML 文字呈現。
- 人物、案例卡都要有文字 badge，例如 `示意人物`／`示範個案`。

## 8. Replacing with Real Assets

- 真實素材在取得公開授權後可替換同一 Asset ID／容器。
- 替換時不改動版面、CTA、流程、價格或個資規則。
- 若素材為客戶案例，仍需確認公開同意、隱私遮蔽與是否可呈現成果。
