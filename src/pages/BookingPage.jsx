import Icon from '../components/ui/Icon'
import { useState } from 'react'
import { navigateTo, useSearchParam } from '../hooks/useRouter'
import { services, isOnsiteRelevant, getServiceById } from '../data/services'
import { consentText, dataUsageNoticeSummary } from '../data/siteContent'
import {
  BOOKING_STEPS,
  createInitialBookingForm,
  validateStep,
  buildBookingPayload,
} from '../lib/booking'
import { createBookingRequest } from '../lib/api'
import BookingStepper from '../components/booking/BookingStepper'
import MaskedHeading from '../components/ui/MaskedHeading'

const contactPreferenceOptions = [
  { value: 'line', label: 'LINE' },
  { value: 'phone', label: '電話' },
  { value: 'either', label: 'LINE 或電話皆可' },
]

const onsiteNeedOptions = [
  { value: 'yes', label: '需要老師到場' },
  { value: 'no', label: '不需要老師到場' },
  { value: 'unsure', label: '尚不確定' },
]

function Field({ label, hint, error, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-style-label-sm text-tea-brown">{label}</span>
      {children}
      {hint ? <span className="text-style-label-sm text-tea-brown/70">{hint}</span> : null}
      {error ? <span className="text-style-label-sm text-error">{error}</span> : null}
    </label>
  )
}

function ChipGroup({ name, options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={`radio-chip px-4 py-2 rounded-[999px] text-style-body-md ${
            value === option.value ? 'is-selected' : ''
          }`}
        >
          <input
            className="sr-only"
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

function BookingPage() {
  const preselectedService = useSearchParam('service')
  const [formValue, setFormValue] = useState(() => createInitialBookingForm(preselectedService))
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [stepError, setStepError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const currentStepKey = BOOKING_STEPS[currentStepIndex].key
  const selectedService = getServiceById(formValue.serviceType)

  const updateField = (name, value) => {
    setStepError('')
    setFormValue((previous) => ({ ...previous, [name]: value }))
  }

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target
    updateField(name, type === 'checkbox' ? checked : value)
  }

  const goToStep = (nextIndex) => {
    setStepError('')
    setSubmitError('')
    setCurrentStepIndex(nextIndex)
    window.scrollTo({ top: 0 })
  }

  const handleNext = () => {
    const validationMessage = validateStep(currentStepKey, formValue)
    if (validationMessage) {
      setStepError(validationMessage)
      return
    }
    goToStep(Math.min(currentStepIndex + 1, BOOKING_STEPS.length - 1))
  }

  const handleBack = () => {
    if (currentStepIndex === 0) {
      navigateTo('/')
      return
    }
    goToStep(currentStepIndex - 1)
  }

  const handleSubmit = async () => {
    const validationMessage = BOOKING_STEPS.map(step => validateStep(step.key, formValue)).find(Boolean)
    if (validationMessage) {
      setStepError(validationMessage)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const payload = buildBookingPayload(formValue)
      const result = await createBookingRequest(payload)
      navigateTo(`/booking/submitted?bookingId=${result.bookingId}`)
    } catch (error) {
      setSubmitError(error.message || '送出失敗，請稍後再試一次。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderNeedStep = () => (
    <>
      <Field label="服務類型（必填）">
        <select
          className="form-line-input"
          name="serviceType"
          value={formValue.serviceType}
          onChange={handleFieldChange}
        >
          <option value="">請選擇最接近的服務</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>
      </Field>

      <Field label="需求簡述（必填）" hint="例如結婚、搬遷、牌位遷移等背景">
        <textarea
          className="form-line-input"
          name="needSummary"
          maxLength={2000}
          rows="4"
          value={formValue.needSummary}
          onChange={handleFieldChange}
          placeholder="請簡述這次想安排的事項"
        />
      </Field>

      <Field label="希望辦理日期／期間（必填）" hint="可填日期區間或重要時程，正式日期仍由老師確認">
        <input
          className="form-line-input"
          name="desiredPeriod"
          value={formValue.desiredPeriod}
          onChange={handleFieldChange}
          placeholder="例如 2026 年 11 月中旬"
        />
      </Field>
    </>
  )

  const renderServiceDetailStep = () => (
    <>
      <p className="text-style-body-md text-tea-brown">
        {selectedService ? selectedService.detail.heroSummary : '請先在上一步選擇服務類型。'}
      </p>

      <Field label="服務相關補充資料（選填）" hint="專業資料先選填，老師確認案件後會再與您確認細節">
        <textarea
          className="form-line-input"
          name="serviceSpecificNote"
          maxLength={2000}
          rows="4"
          value={formValue.serviceSpecificNote}
          onChange={handleFieldChange}
          placeholder="僅填虛構測試資訊，不填真實生辰、地址或身分資料"
        />
      </Field>

      <label className="flex items-start gap-3 bg-surface p-4 border-[0.5px] border-ink/10">
        <input
          className="mt-1 w-5 h-5 accent-vermilion"
          type="checkbox"
          name="serviceSpecificUnsure"
          checked={formValue.serviceSpecificUnsure}
          onChange={handleFieldChange}
        />
        <span className="text-style-body-md text-ink">不確定，希望老師協助確認需要補充哪些資料。</span>
      </label>
    </>
  )

  const renderContactStep = () => (
    <>
      <Field label="聯絡人姓名（必填）">
        <input maxLength={80} className="form-line-input" name="contactName" value={formValue.contactName} onChange={handleFieldChange} />
      </Field>

      <Field label="手機號碼（必填）">
        <input maxLength={30} className="form-line-input" name="contactPhone" value={formValue.contactPhone} onChange={handleFieldChange} />
      </Field>

      <Field label="所在縣市／地區（必填）" hint="完整地址可於人工確認後再補">
        <input
          className="form-line-input"
          name="region"
          value={formValue.region}
          onChange={handleFieldChange}
          placeholder="例如宜蘭縣羅東鎮"
        />
      </Field>

      <Field label="希望聯絡方式（必填）">
        <ChipGroup
          name="contactPreference"
          options={contactPreferenceOptions}
          value={formValue.contactPreference}
          onChange={handleFieldChange}
        />
      </Field>

      <Field label="方便聯絡時間（選填）">
        <input
          className="form-line-input"
          name="contactTime"
          value={formValue.contactTime}
          onChange={handleFieldChange}
          placeholder="例如平日晚上、假日皆可"
        />
      </Field>

      {isOnsiteRelevant(formValue.serviceType) ? (
        <Field label="是否需要老師到場（必填）">
          <ChipGroup
            name="onsiteNeed"
            options={onsiteNeedOptions}
            value={formValue.onsiteNeed}
            onChange={handleFieldChange}
          />
        </Field>
      ) : null}
    </>
  )

  const renderReviewStep = () => (
    <>
      <div className="border-[0.5px] border-ink/10 bg-paper p-6 md:p-8 space-y-8">
        <div>
          <h3 className="text-style-title-lg text-tea-brown mb-4 border-l-2 border-tea-brown pl-3">01 您的需求</h3>
          <div className="grid grid-cols-2 gap-y-2 text-style-body-md pl-4">
            <span className="text-tea-brown">服務項目</span>
            <span className="text-ink">{selectedService?.title || '尚未選擇'}</span>
            <span className="text-tea-brown">需求簡述</span>
            <span className="text-ink">{formValue.needSummary || '—'}</span>
            <span className="text-tea-brown">希望辦理期間</span>
            <span className="text-ink">{formValue.desiredPeriod || '—'}</span>
          </div>
        </div>

        <div>
          <h3 className="text-style-title-lg text-tea-brown mb-4 border-l-2 border-tea-brown pl-3">02 服務相關資料</h3>
          <div className="grid grid-cols-2 gap-y-2 text-style-body-md pl-4">
            <span className="text-tea-brown">補充資料</span>
            <span className="text-ink">
              {formValue.serviceSpecificUnsure ? '不確定，請老師協助確認' : formValue.serviceSpecificNote || '—'}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-style-title-lg text-tea-brown mb-4 border-l-2 border-tea-brown pl-3">03 聯絡與到場</h3>
          <div className="grid grid-cols-2 gap-y-2 text-style-body-md pl-4">
            <span className="text-tea-brown">聯絡人姓名</span>
            <span className="text-ink">{formValue.contactName || '—'}</span>
            <span className="text-tea-brown">聯絡手機</span>
            <span className="text-ink">{formValue.contactPhone || '—'}</span>
            <span className="text-tea-brown">所在縣市／地區</span>
            <span className="text-ink">{formValue.region || '—'}</span>
            <span className="text-tea-brown">希望聯絡方式</span>
            <span className="text-ink">
              {contactPreferenceOptions.find((option) => option.value === formValue.contactPreference)?.label || '—'}
            </span>
            {isOnsiteRelevant(formValue.serviceType) ? (
              <>
                <span className="text-tea-brown">是否需要到場</span>
                <span className="text-ink">
                  {onsiteNeedOptions.find((option) => option.value === formValue.onsiteNeed)?.label || '—'}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <details className="text-style-body-md text-tea-brown">
        <summary className="cursor-pointer text-vermilion underline">資料使用說明</summary>
        <p className="mt-2">{dataUsageNoticeSummary}</p>
      </details>

      <label className="flex items-start gap-3 bg-surface p-6 border-[0.5px] border-ink/10">
        <input
          className="mt-1 w-5 h-5 accent-vermilion"
          type="checkbox"
          name="consent"
          checked={formValue.consent}
          onChange={handleFieldChange}
        />
        <span className="text-style-body-md text-ink">{consentText}</span>
      </label>

      {submitError ? (
        <div className="p-4 bg-error-container/30 border border-error/20 text-style-body-md text-on-surface-variant">
          {submitError}
        </div>
      ) : null}
    </>
  )

  const stepRenderers = {
    need: renderNeedStep,
    'service-detail': renderServiceDetailStep,
    contact: renderContactStep,
    review: renderReviewStep,
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px] pb-16 md:pb-[120px]">
      <header className="mb-10 md:mb-16 text-center">
        <MaskedHeading className="text-style-headline-lg text-ink mb-4">預約申請</MaskedHeading>
        <p className="text-style-body-md text-tea-brown" data-aos="fade-up" data-aos-delay="120">
          本頁僅供虛構資料測試，不成立真實預約，也不會有顧問實際聯繫。
        </p>
      </header>

      <div className="mb-10 md:mb-16" data-aos="fade-up" data-aos-delay="80">
        <BookingStepper currentStepIndex={currentStepIndex} />
      </div>

      {selectedService ? (
        <div className="max-w-3xl mx-auto mb-6 bg-surface-container-low border border-tea-brown/15 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-style-body-md text-ink">
            目前申請服務：<span className="text-vermilion font-medium">{selectedService.title}</span>
          </p>
          <p className="text-style-label-sm text-tea-brown/70">可在第一步改選其他服務</p>
        </div>
      ) : null}

      <form
        className="bg-paper p-6 md:p-12 border-[0.5px] border-ink/10 space-y-8 md:space-y-12"
        onSubmit={(event) => event.preventDefault()}
        data-aos="fade-up"
        data-aos-delay="160"
      >
        <div className="space-y-6">{stepRenderers[currentStepKey]()}</div>

        {stepError ? (
          <div className="p-4 bg-error-container/30 border border-error/20 text-style-body-md text-on-surface-variant">
            {stepError}
          </div>
        ) : null}

        <div className="pt-8 border-t-[0.5px] border-ink/10 flex justify-between items-center gap-4">
          <button
            type="button"
            className="px-6 md:px-8 py-3 text-style-label-sm text-tea-brown hover:text-ink transition-colors flex items-center gap-2"
            onClick={handleBack}
          >
            <Icon className="text-sm">arrow_back</Icon>
            {currentStepIndex === 0 ? '回到首頁' : '上一步'}
          </button>

          {currentStepKey === 'review' ? (
            <button
              type="button"
              className="px-6 md:px-8 py-3 bg-vermilion text-on-primary text-style-label-sm rounded-[2px] hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-60"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? '送出中…' : '送出預約申請'}
              <Icon className="text-sm">check</Icon>
            </button>
          ) : (
            <button
              type="button"
              className="px-6 md:px-8 py-3 bg-vermilion text-on-primary text-style-label-sm rounded-[2px] hover:bg-primary transition-colors"
              onClick={handleNext}
            >
              下一步
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default BookingPage
