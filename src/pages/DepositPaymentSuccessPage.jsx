import { useCallback, useEffect, useState } from 'react'
import { navigateTo, useSearchParam } from '../hooks/useRouter'
import { queryDepositOrder } from '../lib/api'
import { getServiceById } from '../data/services'
import MaskedHeading from '../components/ui/MaskedHeading'

function formatCurrency(value) {
  return Number.isFinite(Number(value)) ? `NT$${Number(value).toLocaleString('zh-Hant-TW')}` : '尚未確認'
}

function DepositPaymentSuccessPage() {
  const merchantTradeNo = useSearchParam('merchantTradeNo')
  const [record, setRecord] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(merchantTradeNo))
  const [errorMessage, setErrorMessage] = useState(merchantTradeNo ? '' : '缺少交易編號，無法查詢付款結果。')

  const loadResult = useCallback(() => {
    if (!merchantTradeNo) {
      return
    }
    setIsLoading(true)
    setErrorMessage('')
    queryDepositOrder(merchantTradeNo)
      .then(setRecord)
      .catch((error) => setErrorMessage(error.message || '查詢付款結果失敗'))
      .finally(() => setIsLoading(false))
  }, [merchantTradeNo])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 回站後需立即主動查單並顯示載入狀態
    loadResult()
  }, [loadResult])

  const isPaid = record?.paymentStatus === 'paid'
  const serviceName = record?.serviceType ? getServiceById(record.serviceType)?.title : null

  return (
    <div className="flex items-center justify-center py-16 md:py-[120px] px-6 md:px-10 lg:px-[80px] w-full max-w-[1440px] mx-auto">
      <article
        className="w-full max-w-4xl bg-surface-container-lowest border border-tea-brown/20 relative"
        data-aos="fade-up"
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-ink/30" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-ink/30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-ink/30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-ink/30" />

        <div className="p-8 md:p-16 flex flex-col items-center">
          {isLoading ? (
            <p className="text-style-body-md text-tea-brown py-16">正在向綠界重新確認這筆預約訂金，請稍候。</p>
          ) : isPaid ? (
            <>
              <div
                className="w-20 h-20 md:w-24 md:h-24 border-[3px] border-vermilion rounded-[2px] flex items-center justify-center mb-8 md:mb-12 relative"
                data-aos="zoom-in"
              >
                <div className="absolute inset-1 border border-vermilion/50 rounded-[2px]" />
                <span className="material-symbols-outlined text-vermilion text-[40px] md:text-[56px]">done</span>
              </div>

              <MaskedHeading className="text-style-headline-lg text-ink text-center mb-16 tracking-wide" delay={0.2}>
                預約訂金付款成功
              </MaskedHeading>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                <div
                  className="col-span-1 md:col-span-2 bg-surface-container-low border border-tea-brown/10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  data-aos="fade-up"
                >
                  <div>
                    <span className="text-style-label-sm text-tea-brown block mb-1">服務名稱</span>
                    <span className="text-style-title-lg text-ink">{serviceName || '—'}</span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-style-label-sm text-tea-brown block mb-1">服務總價</span>
                    <span className="text-style-headline-md text-ink">{formatCurrency(record.confirmedServiceTotal)}</span>
                  </div>
                </div>

                <div
                  className="col-span-1 bg-surface-bright border border-vermilion/30 p-6 md:p-8 relative"
                  data-aos="fade-up"
                  data-aos-delay="80"
                >
                  <span className="text-style-label-sm text-tea-brown block mb-2">已付訂金</span>
                  <span className="text-style-headline-md text-vermilion">{formatCurrency(record.depositAmount)}</span>
                </div>

                <div
                  className="col-span-1 bg-surface-container-highest border border-tea-brown/10 p-6 md:p-8"
                  data-aos="fade-up"
                  data-aos-delay="160"
                >
                  <span className="text-style-label-sm text-tea-brown block mb-2">尾款金額</span>
                  <span className="text-style-headline-md text-ink">{formatCurrency(record.balanceAmount)}</span>
                  <div className="mt-4 pt-4 border-t border-ink/10">
                    <p className="text-style-body-md text-on-surface-variant">尾款收取時間與方式，將依老師確認的案件安排說明。</p>
                  </div>
                </div>
              </div>

              <div className="w-full border-l-[3px] border-tea-brown bg-surface-container p-6 mb-12">
                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-tea-brown mt-1">info</span>
                  <div>
                    <span className="text-style-label-sm text-tea-brown block mb-1 tracking-widest uppercase">注意事項</span>
                    <p className="text-style-body-md text-ink">
                      付款成功僅代表預約訂金已付款，不代表服務已完成，日期／時間仍須人工確認。
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-16 text-center space-y-4">
              <h1 className="text-style-headline-md text-ink">付款結果尚未確認為成功</h1>
              <p className="text-style-body-md text-tea-brown">{errorMessage || '目前查單結果尚未顯示為付款成功，可稍後重新查詢一次。'}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4">
            <a
              className="bg-surface-container-highest border border-tea-brown/20 text-ink text-style-body-md px-10 py-4 hover:bg-surface-dim transition-colors duration-300 text-center"
              href="/"
              onClick={(event) => {
                event.preventDefault()
                navigateTo('/')
              }}
            >
              返回首頁
            </a>
            <button
              type="button"
              className="bg-vermilion text-on-primary text-style-body-md px-10 py-4 hover:bg-primary transition-colors duration-300 text-center"
              onClick={loadResult}
            >
              重新查詢
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}

export default DepositPaymentSuccessPage
