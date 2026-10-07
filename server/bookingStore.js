import crypto from 'node:crypto'
import { readJsonFile, writeJsonFile } from './fileStore.js'

const BOOKINGS_FILE = 'bookings.json'

function readAllBookings() {
  return readJsonFile(BOOKINGS_FILE, [])
}

function generateBookingId() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomPart = crypto.randomBytes(16).toString('hex').toUpperCase()
  return `BK${timestamp}${randomPart}`
}

export function readBooking(bookingId) {
  return readAllBookings().find((booking) => booking.bookingId === bookingId) || null
}

export function createBooking(requestData) {
  const bookingId = generateBookingId()
  const now = new Date().toISOString()

  const record = {
    bookingId,
    bookingStatus: 'awaiting_teacher_confirmation',
    serviceType: requestData.serviceType,
    requestData,
    submittedAt: now,
    confirmedServiceTotal: null,
    depositTier: null,
    depositAmount: null,
    balanceAmount: null,
    paymentStatus: 'not_created',
    merchantTradeNo: null,
    ecpayTradeNo: null,
    createdAt: now,
    updatedAt: now,
  }

  const bookings = readAllBookings()
  bookings.unshift(record)
  writeJsonFile(BOOKINGS_FILE, bookings)

  return record
}

export function updateBooking(bookingId, patch) {
  const bookings = readAllBookings()
  const index = bookings.findIndex((booking) => booking.bookingId === bookingId)

  if (index === -1) {
    return null
  }

  bookings[index] = {
    ...bookings[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  }

  writeJsonFile(BOOKINGS_FILE, bookings)
  return bookings[index]
}
