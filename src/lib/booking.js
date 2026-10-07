import { isOnsiteRelevant } from '../data/services'

export const BOOKING_STEPS = [
  { key: 'need', label: '您的需求' },
  { key: 'service-detail', label: '服務相關資料' },
  { key: 'contact', label: '聯絡與到場' },
  { key: 'review', label: '確認並送出' },
]

export function createInitialBookingForm(preselectedServiceId) {
  return {
    serviceType: preselectedServiceId || '',
    needSummary: '',
    desiredPeriod: '',
    serviceSpecificNote: '',
    serviceSpecificUnsure: false,
    contactName: '',
    contactPhone: '',
    region: '',
    contactPreference: '',
    contactTime: '',
    onsiteNeed: '',
    consent: false,
  }
}

export function validateStep(stepKey, formValue) {
  if (stepKey === 'need') {
    if (!formValue.serviceType) {
      return '請選擇服務類型'
    }
    if (!formValue.needSummary.trim()) {
      return '請簡述您的需求'
    }
    if (!formValue.desiredPeriod.trim()) {
      return '請填寫希望辦理日期或期間'
    }
    return ''
  }

  if (stepKey === 'contact') {
    if (!formValue.contactName.trim()) {
      return '請填寫聯絡人姓名'
    }
    if (!formValue.contactPhone.trim()) {
      return '請填寫手機號碼'
    }
    if (!formValue.region.trim()) {
      return '請填寫所在縣市／地區'
    }
    if (!formValue.contactPreference) {
      return '請選擇希望聯絡方式'
    }
    if (isOnsiteRelevant(formValue.serviceType) && !formValue.onsiteNeed) {
      return '請說明是否需要老師到場'
    }
    return ''
  }

  if (stepKey === 'review') {
    if (!formValue.consent) {
      return '請先閱讀並勾選資料使用同意'
    }
    return ''
  }

  return ''
}

export function buildBookingPayload(formValue) {
  return {
    serviceType: formValue.serviceType,
    needSummary: formValue.needSummary.trim(),
    desiredPeriod: formValue.desiredPeriod.trim(),
    serviceSpecificNote: formValue.serviceSpecificNote.trim(),
    serviceSpecificUnsure: formValue.serviceSpecificUnsure,
    contactName: formValue.contactName.trim(),
    contactPhone: formValue.contactPhone.trim(),
    region: formValue.region.trim(),
    contactPreference: formValue.contactPreference,
    contactTime: formValue.contactTime.trim(),
    onsiteNeed: isOnsiteRelevant(formValue.serviceType) ? formValue.onsiteNeed : '',
    consent: formValue.consent,
  }
}
