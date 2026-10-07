# 部署驗證狀態

更新：2026-10-07。只記錄實際驗證，不把可部署當作已部署。

| 項目 | 狀態／證據 |
|---|---|
| 新專案 | 文件／第五週作業1006_擇日館；獨立Git，原專案未改 |
| GitHub | https://github.com/50819just/xuanjitang-vibe-week05 ；建立與push完成 |
| GitHub Pages | https://50819just.github.io/xuanjitang-vibe-week05/ ；單檔網站公開瀏覽器實測可操作 |
| Pages Actions | 4e53e92的37571844651成功；公開HTML與submission成品SHA256一致；最新瀏覽器預約與服務預選正常 |
| Render | https://xuanjitang-week05-api.onrender.com ；獨立Free Web Service，Deploys最新7f7e3bc顯示Live，測試交易仍在 |
| health | https://xuanjitang-week05-api.onrender.com/api/health ；HTTP成功，environment=stage |
| 前後端連接 | VITE_API_BASE_URL已設定新Render；瀏覽器實際送出申請與建立交易成功 |
| 綠界 | 真正測試頁與主動查單已驗；最終付款／實際通知／回站成功尚未驗完 |
| 單一HTML | dist/index.html、submission/index.html相同；CSS/JS/展示圖片/圖示字型內嵌 |
| VS Code | 新專案已開啟，檔案總管確認src／server |
| 截圖 | docs/screenshots/，公開網站實拍 |

## 後端設定
- branch main、Node24、npm ci、npm start、health `/api/health`。
- ECPAY_ENV=stage，DEMO_CONFIRM_ENABLED=true。
- FRONTEND_BASE_URL指向本作業Pages；APP_BASE_URL以Render外部網址回退。
- 僅使用官方公開測試帳密，未配置正式帳密。
- Render根網址不是前端首頁；請用health連結檢查。

## 部署取捨
Render免費方案可能休眠，冷啟動請稍候重試；JSON測試資料在重啟或部署可能遺失。不能把這版稱為正式預約與收款系統。
為保留正在等待使用者確認的測試交易，最後的純前端／文件提交使用官方支援的 `[skip render]` 標記；GitHub Pages仍正常建置，後端功能不需重新部署。來源：https://render.com/docs/deploys 。

## 作業交付
`submission/README.md`包含動機、公開連結、具體規格、實拍截圖、AI迭代與限制；繳交前仍需本人填入學校／學號／系級／姓名，並在文字輸入區插入截圖。
