import { useEffect, useState } from 'react'
import { navigateTo, useRouter, useSearchParam } from '../hooks/useRouter'
import { queryDepositOrder, createDepositOrder } from '../lib/api'
import { submitEcpayCheckoutForm } from '../lib/ecpay'
import { getServiceById } from '../data/services'
import { contact } from '../data/siteContent'
import { useAuth } from '../hooks/useAuth'
import MaskedHeading from '../components/ui/MaskedHeading'

const TEST_CARD_HINT =
  '測試用信用卡：4311-9522-2222-2222／到期年月任意未來日期／安全碼任意 3 碼／3D 驗證碼 1234'

function DepositPaymentFailedPage() {
  const merchantTradeNo = useSearchParam('merchantTradeNo')
  const { pathname, search } = useRouter()
  const { isMember } = useAuth()
  const [record, setRecord] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(merchantTradeNo))
  const [errorMessage, setErrorMessage] = useState('')
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    if (!merchantTradeNo) {
      return
    }
    queryDepositOrder(merchantTradeNo)
      .then(result => {
        if (result.paymentStatus === 'paid') navigateTo(`/booking/payment/success?merchantTradeNo=${encodeURIComponent(merchantTradeNo)}`)
        else setRecord(result)
      })
      .catch((error) => setErrorMessage(error.message || '查詢付款結果失敗'))
      .finally(() => setIsLoading(false))
  }, [merchantTradeNo])

  const handleRetry = async () => {
    if (!record?.bookingId) {
      return
    }
    if (!isMember) {
      navigateTo(`/sign-in?postLoginPath=${encodeURIComponent(pathname + search)}`)
      return
    }
    setIsRetrying(true)
    setErrorMessage('')
    try {
      const result = await createDepositOrder(record.bookingId)
      submitEcpayCheckoutForm(result.action, result.fields)
    } catch (error) {
      setErrorMessage(error.message || '重新建立訂金交易失敗')
      setIsRetrying(false)
    }
  }

  const serviceName = record?.serviceType ? getServiceById(record.serviceType)?.title : null

  return (
    <div className="flex items-center justify-center py-16 md:py-[120px] px-6 md:px-10 lg:px-[80px]">
      <div
        className="w-full max-w-[800px] mx-auto bg-surface-container-highest border border-tea-brown/20 p-8 md:p-16 relative"
        data-aos="fade-up"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-vermilion/50 to-transparent opacity-50" />

        <div className="flex flex-col items-center text-center mb-12">
          <span className="material-symbols-outlined text-[64px] text-error mb-6" data-aos="zoom-in">
            error
          </span>
          <MaskedHeading className="text-style-headline-lg text-ink mb-4" delay={0.15}>
            付款未完成
          </MaskedHeading>
          <p className="text-style-body-lg text-tea-brown max-w-[500px]">
            很抱歉，您的預約訂金付款程序未能順利完成。您的預約申請目前處於保留狀態。
          </p>
        </div>

        {isLoading ? (
          <p className="text-style-body-md text-tea-brown text-center mb-12">正在查詢最新付款狀態…</p>
        ) : (
          <div className="border-t border-b border-ink/10 py-8 mb-12">
            <h2 className="text-style-title-lg text-ink mb-6 text-center">預約資訊摘要</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex flex-col gap-1 border-b border-ink/5 pb-2">
                <span className="text-style-label-sm text-tea-brown uppercase tracking-wider">預約項目</span>
                <span className="text-style-body-lg text-ink">{serviceName || '—'}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-ink/5 pb-2">
                <span className="text-style-label-sm text-tea-brown uppercase tracking-wider">申請編號</span>
                <span className="text-style-body-lg text-ink">{record?.bookingId || merchantTradeNo || '—'}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-ink/5 pb-2">
                <span className="text-style-label-sm text-tea-brown uppercase tracking-wider">案件狀態</span>
                <span className="text-style-body-lg text-ink">
                  {record?.bookingStatus === 'deposit_paid' ? '已付款' : '尚未完成付款'}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-b border-ink/5 pb-2">
                <span className="text-style-label-sm text-tea-brown uppercase tracking-wider">應付訂金</span>
                <span className="text-style-body-lg text-vermilion font-medium">
                  {record?.depositAmount != null && Number.isFinite(Number(record.depositAmount))
                    ? `NT$${Number(record.depositAmount).toLocaleString('zh-Hant-TW')}`
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        )}

        {errorMessage ? <p className="text-style-body-md text-error text-center mb-6">{errorMessage}</p> : null}

        <p className="text-style-label-sm text-tea-brown text-center mb-4">{TEST_CARD_HINT}</p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <button
            type="button"
            className="w-full md:w-auto bg-vermilion text-on-primary text-style-body-md px-12 py-4 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
            onClick={handleRetry}
            disabled={isRetrying || !record?.bookingId || record?.paymentStatus === 'paid'}
          >
            <span className="material-symbols-outlined">refresh</span>
            {isRetrying ? '正在重新建立…' : isMember ? '重新支付預約訂金' : '登入後重新支付預約訂金'}
          </button>
          <a
            className="w-full md:w-auto bg-transparent border border-tea-brown text-tea-brown text-style-body-md px-12 py-4 hover:bg-tea-brown/5 transition-colors flex items-center justify-center gap-2"
            href={import.meta.env.BASE_URL}
          >
            <span className="material-symbols-outlined">support_agent</span>
            回到作業首頁（{contact.phone}）
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-style-label-sm text-tea-brown/60">這是綠界測試流程，不提供真實客服或收款。</p>
        </div>
      </div>
    </div>
  )
}

export default DepositPaymentFailedPage
