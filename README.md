# 玄機堂擇日舘｜第五週 Vibe Coding

專案名稱：`xuanjitang-vibe-week05`。本專案是本人六角學院舊作的獨立改作，不覆寫舊專案。
開發環境：React + Vite／Node.js。綠界僅真實測試環境，禁止正式收款，不成立真實預約。

## 本機啟動
```sh
npm ci
npm run dev:all
```
前端 http://localhost:5175，API http://localhost:3005/api/health。
```sh
npm run lint
npm test
npm run build
```

## 金流
- 僅使用綠界官方公開測試商店；stage endpoint 固定，不能切正式收款。
- 先建立測試申請 → 模擬確認總價 → 示意會員 → 綠界測試付款 → 驗證通知／主動查單。
- 簽章與查單只在後端。假通知、不同金額、未知訂單、簽章錯誤不能判成功。
- 示意會員不是認證系統；請勿填寫真實個資或正式卡號。
- 免費後端的 JSON 檔只作短期測試，休眠／重啟可能遺失。正式使用前需資料庫、存取權限、冪等與安全稽核。
- 官方資料：https://developers.ecpay.com.tw/2856/ 、https://developers.ecpay.com.tw/2878/ 、https://developers.ecpay.com.tw/2890/ 、https://developers.ecpay.com.tw/2902/ 。

## 部署
- GitHub Pages 部署前端，新的測試 API 另部署 Render；不能沿用舊後端。
- Render 依 render.yaml 建立 Free Web Service，APP_BASE_URL 填新服務實際 HTTPS 網址，FRONTEND_BASE_URL 填新 Pages 網址。
- GitHub repository variables 的 VITE_API_BASE_URL 填新 API 實際網址，再重新執行 Pages workflow。
- 未設定 API 時，公開前端只供瀏覽，表單明確提示後端尚未設定，不假裝送出成功。
- 首次部署狀態與 QA 詳見 docs/DEPLOYMENT_STATUS.md；尚未驗證的部署不能寫成成功。

## 作業交付待辦
本輪先建立可修改的獨立 React 開發副本；目前入口 index.html 仍依賴編譯資源，尚不等於老師要求的單一 HTML 成品。
後續需完成本次規格書、單一 index.html、操作截圖、AI 迭代紀錄與公開連結驗證。
準時截止 2026-10-19 23:59；遲交截止 2026-10-20 16:00（台北時間）。

## 來源保護
未複製舊 .git、.env、客戶／訂單資料、歷史 build 或 node_modules。
只供本機參考的來源文件、路徑與指紋不提交公開 GitHub。
