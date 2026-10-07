# 部署驗證狀態

更新：2026-10-07。

- 本機獨立複製：完成；原專案未改。
- 新 repo 名稱：xuanjitang-vibe-week05。
- GitHub 認證：等待使用者完成官方登入授權。
- GitHub 儲存庫建立／push：尚未完成。
- GitHub Pages：尚未部署驗證。
- 新 Render stage API：設定檔完成，尚未建立服務或取得實際網址。
- 綠界程式：stage-only 安全調整完成；本輪完整付款／回呼／查單 E2E 尚未通過。
- VS Code：已開啟本專案資料夾並由介面檔案總管確認。
- 單一 HTML 最終交付：尚未完成。

免費 Render 服務休眠／重啟可清除 JSON 資料，僅供短期測試。不得將此版本稱正式預約／收款系統。

## 本機已驗證
- npm run lint：通過。
- npm test：4/4 通過，含官方 SHA256 範例、空欄位、竄改防護及 stage 限制。
- npm run build：通過。
- npm audit：原有 3 項高風險相依套件已以相容修補更新，目前 0 項。
- API：health、必填驗證、建立虛構預約、未確認不能付款、NT$5,000/800/4,200、錯誤簽章拒收、SimulatePaid 不標 paid、未知訂單拒絕，皆通過。
- 本機服務：前端 5175、API 3005；與舊站分離。
