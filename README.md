# 北科大 114AC8507 職碩2 互動所 彭致嘉 玄機堂擇日舘：傳統產業數位預約

## 發想動機
這個網站是為了朋友家人的傳統產業轉型而發想的。希望把服務介紹、需求蒐集、預約申請與費用確認整理到網站裡，讓顧客可以先了解服務，再用手機或電腦留下需求，也讓經營者未來更容易整理案件。
以擇日與宅事為主題，保留傳統文化的水墨、書法與暖紙色視覺，再加入清楚的數位預約流程。

## 公開連結
- **作品（GitHub Pages）**：https://50819just.github.io/xuanjitang-vibe-week05/
- **GitHub 原始碼**：https://github.com/50819just/xuanjitang-vibe-week05
- **Render 測試後端**：https://xuanjitang-week05-api.onrender.com
- **後端啟動檢查**：https://xuanjitang-week05-api.onrender.com/api/health

GitHub Pages 只負責靜態前端，無法自行執行綠界 API 的後端程式。因此，本作品把 Node.js 後端獨立部署到 Render，由前端呼叫；不是把正式金鑰放在網頁裡。
Render 根網址沒有一般網站首頁，請用 `/api/health` 看啟動狀態。Free 方案會休眠，首次請求可能需要約一分鐘；測試資料也可能因重啟或部署而遺失。

## 作品特點
1. **可預約**：四步表單、必填驗證、資料摘要、使用同意、送出申請與案件編號。
2. **RWD**：桌機／手機共用流程，手機導覽選單、服務卡片與表單會隨畫面調整；手機導覽不固定遮蓋內文，必填錯誤自動帶回欄位上方。
3. **服務資訊完整**：7類服務、參考價格、服務方式、FAQ、知識文章。
4. **綠界真正測試串接**：使用官方測試付款頁，後端產生簽章、接收通知與主動查單；不只是展示一個假付款按鈕。
5. **金額流程清楚**：模擬確認總價後，自動計算訂金與尾款，並防止已付款重複付款。
6. **單一 HTML 成品**：JS、CSS、圖片及SVG圖示都內嵌，GitHub Pages 部署的就是此成品。

## 規格與交付文件
- `SPEC.md`：背景、目標、功能、流程、資料、例外與可測試驗收條件。
- `docs/CHANGELOG.md`：實際與 AI 討論、修正、測試的迭代紀錄。
- `docs/QA_2026-10-07.md`：本輪檢查結果與證據邊界。
- `docs/VISUAL_QA_2026-10-07.md`：本輪公開桌機／手機針對性視覺驗收與截圖版本。
- `docs/DEPLOYMENT_STATUS.md`：前後端部署與驗證狀態。
- `docs/design/`：保留的視覺參考，不取代本次功能規格。
- `submission/README.md`：可複製到作業文字輸入區的交付說明。
- [`submission/index.html`](submission/index.html)：已提交的單一成品，與本機 `dist/index.html` 相同；GitHub 大檔預覽可能需按 Download raw file。
- `docs/screenshots/`：由實際公開網站拍攝的介面截圖，非設計稿。

![桌機首頁](docs/screenshots/desktop-home.png)

[手機預約截圖](docs/screenshots/mobile-booking.png)・[必填驗證截圖](docs/screenshots/mobile-validation.png)

## 操作方式
1. 開啟作品 → 選擇服務 → 開始預約。
2. 只填虛構資料；可用測試甲、0900000000、虛構地區。
3. 填完四步、確認摘要、勾選同意後送出。
4. 在送出頁模擬確認總價，例如5,000元；訂金800元、尾款4,200元。
5. 使用頁面提示的示意帳密登入，再前往綠界測試付款。
6. 使用官方測試卡，不用真實信用卡；回站後由後端主動查單判斷結果。

**注意：這是展示版，不扣真錢、不成立真實預約、不提供實際顧問聯繫。** 示意登入不是真實認證，LINE未啟用；不要輸入真實個資或正式帳密。

## 額外功能：綠界信用卡測試展示（非作業必要項目）
為了探索朋友家人傳統產業的數位轉型，本作品額外把 Render 測試後端與綠界官方測試環境串接。**請從上方 GitHub Pages 前台操作**；Render 的 `/api/health` 只顯示後端狀態 JSON，不是另一個前台網站，也不是付款入口。

### 操作步驟
1. 開啟 GitHub Pages → 選擇服務 → 開始預約。只用虛構資料，例如姓名「測試甲」、手機「0900000000」、地區「虛構測試地區」。
2. 填完四步、確認摘要及展示版資料使用說明，送出測試申請。
3. 在送出頁模擬確認總價 **5,000元**，畫面會顯示訂金 **800元**、尾款 **4,200元**。
4. 使用網站示意登入：Email **demo@xuanjitang.tw**、密碼 **demo1234**。這不是正式帳號，請勿使用個人帳密。
5. 按「支付預約訂金（Demo）」進入綠界測試付款頁；確認網域是 **payment-stage.ecpay.com.tw**、商品是「玄機堂擇日舘預約訂金」、金額 **NT$800**。
6. 如需自行試刷，選擇信用卡並使用以下測試資料；請勿輸入真實卡號、真實個資，也不要勾選記住付款人資訊。

### 測試信用卡與虛構填寫範例
| 欄位 | 測試資料 |
| --- | --- |
| 信用卡類型 | VISA / MasterCard / JCB（一般信用卡） |
| 綠界官方測試卡號 | **4311-9522-2222-2222** |
| 有效月／年 | **12 / 2029**；若頁面顯示 MM / YY，填 **12 / 29**。這是未過期的範例日期，非官方指定固定日期；到期後改填未來月／年。 |
| 安全碼（CVV） | **123**（官方允許任意三碼數字） |
| 持卡人英文姓名 | **TEST USER**（虛構範例） |
| 手機號碼 | **0900000000**（虛構範例，非官方保證測試號碼；若頁面不接受請停止，不改用真實手機） |
| 電子信箱 | **demo@example.com**（虛構範例，若非必填也可留空） |
| 帳單地址 | 若非必填可留空；需要時只填虛構資料 |
| 3D驗證碼 | **1234**（綠界測試環境固定值，不需接收真實簡訊） |

卡號、CVV規則、有效日期及3D驗證碼依[綠界官方測試介接資訊](https://developers.ecpay.com.tw/2856/)（2026-10-07查核）；姓名、手機、Email為本作品的虛構範例，不是綠界核發資料。

**實際驗證界線**：已於2026-10-07使用公開前台、虛構資料與Render後端，實測「預約送出 → 模擬確認總價 → 示意登入 → 建立訂金交易 → 綠界信用卡測試頁」，商品與NT$800金額正確。本輪付款入口滑鼠操作未觸發，改用鍵盤Enter後成功，滑鼠原因尚待確認。尚未按「立即付款」，因此**測試刷卡成功、3D驗證完成、付款通知與回站成功尚未驗證**；不宣稱正式收款或支付端到端全部通過。

![綠界信用卡測試頁（已到達，未付款）](https://raw.githubusercontent.com/50819just/xuanjitang-vibe-week05/main/docs/screenshots/ecpay-stage-checkout.png)

## 開發與驗證
```sh
npm ci
npm run dev:all
```
前端：`http://localhost:5175`；後端：`http://localhost:3005/api/health`。
```sh
npm run lint
npm test
VITE_API_BASE_URL=https://xuanjitang-week05-api.onrender.com npm run build
npm audit
```
根目錄 `index.html` 是 React 開發入口；交付使用 **`submission/index.html`** 或 **`dist/index.html`**，不要拿開發入口冒充單檔成品。
建置約6.4MiB，離線可瀏覽、導覽與填表；送出與綠界付款仍需網路與後端。請以公開連結驗收完整流程。

## 部署
Pages workflow 自動檢查、建置和部署；repository variable `VITE_API_BASE_URL` 已指向獨立 Render API。
Render使用 `npm ci`／`npm start`、Node24、`ECPAY_ENV=stage`、`DEMO_CONFIRM_ENABLED=true`，health path `/api/health`。
本版強制 stage，不接受正式收款。正式營運前仍需資料庫、真正認證／授權、流量控制、法務與安全稽核。

## 來源與 AI 協作說明
本作品由本人既有擇日館專案獨立改作，不覆寫原始專案；未複製舊金鑰、客戶資料、訂單或 Git 歷史。
本次利用 AI 整理規格、調整部署、檢查程式、修正驗證與付款狀態、製作單檔成品與測試。既有設計與程式重用，和本次新增內容分開說明，避免誤稱全部從零完成。

## 官方技術參考
- GitHub Pages 靜態託管：https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Render Free 限制：https://render.com/docs/free
- 綠界測試帳號／卡號：https://developers.ecpay.com.tw/2856/
- 綠界通知：https://developers.ecpay.com.tw/2878/
- 綠界查單：https://developers.ecpay.com.tw/2890/
- 綠界簽章：https://developers.ecpay.com.tw/2902/

作業期限：10/19 23:59；遲交期限10/20 16:00。繳交標題：北科大 114AC8507 職碩2 互動所 彭致嘉 玄機堂擇日舘：傳統產業數位預約。
