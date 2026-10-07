# 玄機堂擇日舘｜傳統產業數位預約展示

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
2. **RWD**：桌機／手機共用流程，手機導覽選單、服務卡片與表單會隨畫面調整。
3. **服務資訊完整**：7類服務、參考價格、服務方式、FAQ、知識文章。
4. **綠界真正測試串接**：使用官方測試付款頁，後端產生簽章、接收通知與主動查單；不只是展示一個假付款按鈕。
5. **金額流程清楚**：模擬確認總價後，自動計算訂金與尾款，並防止已付款重複付款。
6. **單一 HTML 成品**：JS、CSS、圖片及SVG圖示都內嵌，GitHub Pages 部署的就是此成品。

## 規格與交付文件
- `SPEC.md`：背景、目標、功能、流程、資料、例外與可測試驗收條件。
- `docs/CHANGELOG.md`：實際與 AI 討論、修正、測試的迭代紀錄。
- `docs/QA_2026-10-07.md`：本輪檢查結果與證據邊界。
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

作業期限：10/19 23:59；遲交期限10/20 16:00。繳交標題仍需自行填入學校、學號、系級與姓名。
