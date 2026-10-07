import { useEffect, useState } from 'react'

const AUTH_EVENT = 'app:auth-change'

let isMemberState = false
let memberEmailState = ''

export function getIsMember() {
  return isMemberState
}

export function signIn(email) {
  isMemberState = true
  memberEmailState = email
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function signOut() {
  isMemberState = false
  memberEmailState = ''
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function useAuth() {
  const [isMember, setIsMember] = useState(isMemberState)

  useEffect(() => {
    const handleChange = () => setIsMember(isMemberState)
    window.addEventListener(AUTH_EVENT, handleChange)
    return () => window.removeEventListener(AUTH_EVENT, handleChange)
  }, [])

  return { isMember, memberEmail: memberEmailState }
}
