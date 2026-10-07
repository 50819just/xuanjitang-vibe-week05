# 2026-10-07｜獨立複製與首次部署計畫

使用者授權：複製獨立專案、建立新 GitHub 儲存庫、先部署並開啟 VS Code；綠界明確選擇真實測試環境，不正式收款。

1. 保留舊專案不動，以目前本機程式與素材建立乾淨副本；不複製 .git、.env、server/data、node_modules、dist、歷史 build、個資與登入設定。
2. 新專案名稱 xuanjitang-vibe-week05；修改 base path、CI、後端服務名稱與網址設定，禁止指向舊 API。
3. 金流 stage-only，驗證通知與查單簽章，公開頁面標示測試、不收真錢、勿填真實個資；示意會員非認證。
4. build、lint、單元與 API 測試通過後建立獨立 Git 歷史、GitHub 儲存庫、Pages。
5. 部署新後端並核對 HTTPS 回呼；完整測試付款、取消、查單後才能宣稱綠界 E2E 通過。
6. 在 VS Code 開啟此資料夾供後續修改。

阻礙需如實交代：GitHub 登入、Render 登入／服務授權、公開 API 實際網址、完整付款驗證。
本輪先保留 React 開發版本；作業最終單一 index.html 與完整規格／截圖仍需後續收斂，不稱作業已完成。
