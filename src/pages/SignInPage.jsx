import { useState } from 'react'
import { navigateTo, useSearchParam } from '../hooks/useRouter'
import { signIn } from '../hooks/useAuth'
import MaskedHeading from '../components/ui/MaskedHeading'

const TEST_EMAIL = 'demo@xuanjitang.tw'
const TEST_PASSWORD = 'demo1234'

function SignInPage() {
  const postLoginPath = useSearchParam('postLoginPath')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('請輸入帳號與密碼')
      return
    }

    signIn(email.trim())
    navigateTo(postLoginPath ? decodeURIComponent(postLoginPath) : '/')
  }

  return (
    <div className="max-w-[480px] mx-auto px-6 py-16 md:py-[120px]">
      <div className="text-center mb-10">
        <MaskedHeading as="h1" className="text-style-headline-md text-ink mb-4">
          會員登入
        </MaskedHeading>
        <p className="text-style-body-md text-tea-brown">
          登入後才能繼續支付預約訂金。這裡是作業驗收用的示意登入，不是正式身分驗證系統。
        </p>
      </div>

      <div className="mb-6 p-4 border-2 border-dashed border-vermilion/50 bg-surface text-style-body-md text-ink">
        <span className="inline-block bg-vermilion text-on-primary text-style-label-sm px-3 py-1 mb-2">
          測試用帳密
        </span>
        <p>帳號：{TEST_EMAIL}</p>
        <p>密碼：{TEST_PASSWORD}</p>
        <p className="text-style-label-sm text-tea-brown mt-2">
          僅供作業驗收使用；實際上輸入任何帳號密碼皆可登入。
        </p>
      </div>

      <form className="bg-paper p-6 md:p-10 border-[0.5px] border-ink/10 space-y-6" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2">
          <span className="text-style-label-sm text-tea-brown">帳號（Email）</span>
          <input
            className="form-line-input"
            type="email"
            value={email}
            onChange={(event) => {
              setError('')
              setEmail(event.target.value)
            }}
            placeholder={TEST_EMAIL}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-style-label-sm text-tea-brown">密碼</span>
          <input
            className="form-line-input"
            type="password"
            value={password}
            onChange={(event) => {
              setError('')
              setPassword(event.target.value)
            }}
            placeholder="········"
          />
        </label>

        {error ? <p className="text-style-body-md text-error">{error}</p> : null}

        <button
          type="submit"
          className="w-full bg-vermilion text-on-primary py-3 rounded-[2px] text-style-title-lg hover:bg-primary transition-colors"
        >
          登入
        </button>
      </form>
    </div>
  )
}

export default SignInPage
