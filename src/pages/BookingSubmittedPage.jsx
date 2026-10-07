import { useEffect, useState } from 'react'
import { navigateTo, useRouter, useSearchParam } from '../hooks/useRouter'
import { fetchBooking, demoConfirmBooking, createDepositOrder } from '../lib/api'
import { submitEcpayCheckoutForm } from '../lib/ecpay'
import { useAuth } from '../hooks/useAuth'
import MaskedHeading from '../components/ui/MaskedHeading'

const TEST_CARD_HINT =
  '測試用信用卡：4311-9522-2222-2222／到期年月任意未來日期／安全碼任意 3 碼／3D 驗證碼 1234'

function BookingSubmittedPage() {
  const bookingId = useSearchParam('bookingId')
  const { pathname, search } = useRouter()
  const { isMember, memberEmail } = useAuth()
  const [booking, setBooking] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [demoTotalInput, setDemoTotalInput] = useState('5000')
  const [demoError, setDemoError] = useState('')
  const [isDemoConfirming, setIsDemoConfirming] = useState(false)
  const [isCreatingDeposit, setIsCreatingDeposit] = useState(false)

  useEffect(() => {
    if (!bookingId) {
      return
    }

    fetchBooking(bookingId)
      .then(setBooking)
      .catch((error) => setLoadError(error.message || '無法讀取這筆預約申請'))
  }, [bookingId])

  const handleDemoConfirm = async () => {
    setDemoError('')
    setIsDemoConfirming(true)
    try {
      const updated = await demoConfirmBooking(bookingId, Number(demoTotalInput))
      setBooking(updated)
    } catch (error) {
      setDemoError(error.message || '模擬確認失敗')
    } finally {
      setIsDemoConfirming(false)
    }
  }

  const handlePayDeposit = async () => {
    if (!isMember) {
      navigateTo(`/sign-in?postLoginPath=${encodeURIComponent(pathname + search)}`)
      return
    }

    setDemoError('')
    setIsCreatingDeposit(true)
    try {
      const result = await createDepositOrder(bookingId)
      submitEcpayCheckoutForm(result.action, result.fields)
    } catch (error) {
      setDemoError(error.message || '建立訂金交易失敗')
      setIsCreatingDeposit(false)
    }
  }

  return (
    <div className="w-full max-w-[1440px] px-6 md:px-10 lg:px-[80px] py-16 md:py-[120px] mx-auto text-center flex flex-col items-center">
      <div className="mb-12 flex justify-center" data-aos="zoom-in">
        <div
          className="w-24 h-24 border-2 border-vermilion flex items-center justify-center relative overflow-hidden bg-surface-container-lowest"
          style={{ transform: 'rotate(-3deg)' }}
        >
          <span className="material-symbols-outlined text-vermilion text-[48px]">check_circle</span>
        </div>
      </div>

      <MaskedHeading className="text-style-headline-lg text-ink mb-6 tracking-wide" delay={0.2}>
        預約申請已送出
      </MaskedHeading>

      <div className="max-w-xl mx-auto space-y-6" data-aos="fade-up" data-aos-delay="100">
        <p className="text-style-body-lg text-on-surface-variant">
          測試申請已建立；本頁可模擬確認費用，再進入綠界測試付款。不會有真實顧問聯繫。
        </p>

        <div className="py-6 border-t border-b border-ink/10 my-8 relative">
          <p className="text-style-body-md text-tea-brown">正式服務內容、費用與安排，將於人工確認後說明。</p>
        </div>

        {!bookingId ? (
          <p className="text-style-body-md text-error">找不到這筆預約申請，請確認連結是否完整。</p>
        ) : null}
        {loadError ? <p className="text-style-body-md text-error">{loadError}</p> : null}

        <a
          className="inline-flex items-center justify-center px-10 py-4 bg-vermilion text-on-primary text-style-body-md tracking-widest hover:bg-primary transition-colors duration-300 mt-8"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigateTo('/')
          }}
        >
          返回首頁
        </a>
      </div>

      {bookingId ? (
        <div
          className="mt-16 w-full max-w-xl border-2 border-dashed border-vermilion/50 bg-surface p-6 text-left"
          data-aos="fade-up"
        >
          <span className="inline-block bg-vermilion text-on-primary text-style-label-sm px-3 py-1 mb-4">
            僅供開發／作業驗收使用
          </span>

          {booking?.bookingStatus === 'deposit_ready' ? (
            <div className="space-y-4">
              <p className="text-style-body-md text-ink">
                Demo 模擬老師已確認：服務總價 NT${booking.confirmedServiceTotal?.toLocaleString('zh-Hant-TW')}，
                預約訂金 NT${booking.depositAmount?.toLocaleString('zh-Hant-TW')}，尾款 NT$
                {booking.balanceAmount?.toLocaleString('zh-Hant-TW')}。
              </p>
              <p className="text-style-label-sm text-tea-brown">
                {isMember ? `已登入：${memberEmail}` : '支付訂金前需要先登入會員（作業驗收用示意登入）。'}
              </p>
              <p className="text-style-label-sm text-tea-brown">{TEST_CARD_HINT}</p>
              <button
                type="button"
                className="w-full bg-vermilion text-on-primary py-3 text-style-body-md disabled:opacity-60"
                onClick={handlePayDeposit}
                disabled={isCreatingDeposit}
              >
                {isCreatingDeposit
                  ? '正在建立訂金交易…'
                  : isMember
                    ? '支付預約訂金（Demo）'
                    : '登入後支付預約訂金（Demo）'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-style-body-md text-tea-brown">
                這個工具用來模擬「老師已人工確認服務總價」，正式使用者不會看到這個區塊。
              </p>
              <label className="flex flex-col gap-2">
                <span className="text-style-label-sm text-tea-brown">模擬確認的服務總價（NT$）</span>
                <input
                  className="form-line-input"
                  type="number"
                  min="1"
                  value={demoTotalInput}
                  onChange={(event) => setDemoTotalInput(event.target.value)}
                />
              </label>
              <button
                type="button"
                className="w-full border border-tea-brown text-tea-brown py-3 text-style-body-md disabled:opacity-60"
                onClick={handleDemoConfirm}
                disabled={isDemoConfirming}
              >
                {isDemoConfirming ? '確認中…' : '模擬老師已確認總價'}
              </button>
            </div>
          )}

          {demoError ? <p className="text-style-body-md text-error mt-4">{demoError}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

export default BookingSubmittedPage
