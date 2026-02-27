'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, ArrowRight, Check, X } from 'lucide-react'

const pwRules = [
  { label: 'At least 8 characters', ok: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', ok: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', ok: (p: string) => /\d/.test(p) },
]

export default function SignUpPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    agreeToTerms: false,
  })

  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  const strength = pwRules.filter((r) => r.ok(form.password)).length
  const strengthText = ['', 'Weak', 'Fair', 'Strong'][strength]
  const strengthColor = ['', '#ef4444', '#f59e0b', '#22c55e'][strength]

  const passwordsMatch = form.confirm === form.password

  /* Map thrown error messages → friendly ones */
  const friendlyError = (msg: string) => {
    if (msg.includes('already exists'))
      return 'An account with this email already exists.'
    if (msg.includes('Email and password'))
      return 'Email and password are required.'
    return msg || 'Something went wrong. Please try again.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!passwordsMatch) {
      setError('Passwords do not match.')
      return
    }
    if (strength < 2) {
      setError('Please choose a stronger password.')
      return
    }
    if (!form.agreeToTerms) {
      setError('You must agree to the terms to continue.')
      return
    }

    setLoading(true)

    const res = await signIn('credentials', {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      agreeToTerms: String(form.agreeToTerms),
      role: 'user',
      isSignUp: 'true',
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError(friendlyError(res.error))
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleGoogle = async () => {
    setGLoading(true)
    await signIn('google', { callbackUrl: '/' })
  }

  return (
    <main className="root">
      <div className="bg-grid" />
      <div className="blob b1" />
      <div className="blob b2" />

      <div className="card">
        {/* brand */}
        <Link href="/" className="brand">
          <Image
            src="/logo-bg.png"
            width={200}
            height={200}
            alt="logo"
            className="brand-img"
          />
          <span className="brand-name">তুলিকনা</span>
        </Link>

        <h1 className="title">Create account</h1>
        <p className="sub">Join us — it only takes a minute.</p>

        {/* google */}
        <button
          onClick={handleGoogle}
          disabled={gLoading}
          className="oauth-btn"
        >
          {gLoading ? <Loader2 size={17} className="spin" /> : <GoogleIcon />}
          Sign up with Google
        </button>

        <div className="sep">
          <span>or fill in your details</span>
        </div>

        {error && (
          <div className="err">
            <X size={13} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form" noValidate>
          {/* name row */}
          <div className="row2">
            <label className="lbl">
              First Name
              <input
                className="inp"
                type="text"
                autoComplete="given-name"
                required
                placeholder="Rahim"
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
              />
            </label>
            <label className="lbl">
              Last Name
              <input
                className="inp"
                type="text"
                autoComplete="family-name"
                required
                placeholder="Uddin"
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
              />
            </label>
          </div>

          {/* email */}
          <label className="lbl">
            Email
            <input
              className="inp"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </label>

          {/* phone */}
          <label className="lbl">
            Phone <span className="opt">(optional)</span>
            <input
              className="inp"
              type="tel"
              autoComplete="tel"
              placeholder="+880 1xxx xxxxxx"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </label>

          {/* password */}
          <label className="lbl">
            Password
            <div className="pw-wrap">
              <input
                className="inp"
                type={showPw ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPw((p) => !p)}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {/* strength */}
            {form.password.length > 0 && (
              <>
                <div className="strength-row">
                  <div className="bars">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="bar"
                        style={{
                          background:
                            i < strength
                              ? strengthColor
                              : 'rgba(255,255,255,.1)',
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="strength-txt"
                    style={{ color: strengthColor }}
                  >
                    {strengthText}
                  </span>
                </div>
                <ul className="rules">
                  {pwRules.map((r) => {
                    const pass = r.ok(form.password)
                    return (
                      <li
                        key={r.label}
                        style={{ color: pass ? '#22c55e' : '#ef4444' }}
                      >
                        {pass ? <Check size={10} /> : <X size={10} />}
                        {r.label}
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </label>

          {/* confirm */}
          <label className="lbl">
            Confirm Password
            <div className="pw-wrap">
              <input
                className="inp"
                type={showConfirm ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.confirm}
                onChange={(e) => set('confirm', e.target.value)}
                style={{
                  borderColor:
                    form.confirm.length > 0
                      ? passwordsMatch
                        ? '#22c55e'
                        : '#ef4444'
                      : undefined,
                }}
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowConfirm((p) => !p)}
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {form.confirm.length > 0 && !passwordsMatch && (
              <span className="mismatch">Passwords do not match</span>
            )}
          </label>

          {/* terms */}
          <label className="terms-lbl">
            <input
              type="checkbox"
              checked={form.agreeToTerms}
              onChange={(e) => set('agreeToTerms', e.target.checked)}
              className="chk"
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" className="tlink">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="tlink">
                Privacy Policy
              </Link>
            </span>
          </label>

          <button type="submit" disabled={loading} className="submit">
            {loading ? (
              <Loader2 size={16} className="spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <p className="switch">
          Already have an account? <Link href="/auth/sign-in">Sign in</Link>
        </p>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Outfit:wght@300;400;500&display=swap');
        :global(body) {
          margin: 0;
        }

        .root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0e0e12;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 2rem 1rem;
        }

        .bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
          pointer-events: none;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.5;
        }
        .b1 {
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, #0ea5e955, transparent 70%);
          top: -140px;
          left: -120px;
          animation: flt 14s ease-in-out infinite alternate;
        }
        .b2 {
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, #7c3aed55, transparent 70%);
          bottom: -100px;
          right: -100px;
          animation: flt 11s ease-in-out infinite alternate-reverse;
        }
        @keyframes flt {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(25px, 18px) scale(1.07);
          }
        }

        .card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 460px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2.5rem 2rem 2rem;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.04),
            0 24px 48px rgba(0, 0, 0, 0.5);
          animation: rise 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          margin-bottom: 1.8rem;
        }
        .brand-img {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          object-fit: cover;
        }
        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          color: #fff;
        }

        .title {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.25rem;
        }
        .sub {
          font-size: 0.85rem;
          color: #888;
          margin: 0 0 1.6rem;
          font-weight: 300;
        }

        .oauth-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 0.72rem 1rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #e0e0e0;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition:
            background 0.2s,
            border-color 0.2s;
        }
        .oauth-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.22);
        }
        .oauth-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .sep {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 1.3rem 0;
          color: #444;
          font-size: 0.78rem;
        }
        .sep::before,
        .sep::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .err {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          font-size: 0.82rem;
          border-radius: 10px;
          padding: 0.6rem 0.9rem;
          margin-bottom: 1.2rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .row2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .lbl {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #888;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .opt {
          text-transform: none;
          font-weight: 300;
          letter-spacing: 0;
          font-size: 0.75rem;
          color: #555;
        }

        .inp {
          width: 100%;
          padding: 0.68rem 0.88rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #f0f0f0;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition:
            border-color 0.2s,
            background 0.2s;
          box-sizing: border-box;
        }
        .inp::placeholder {
          color: #3a3a3a;
        }
        .inp:focus {
          border-color: #0ea5e9;
          background: rgba(14, 165, 233, 0.07);
        }

        .pw-wrap {
          position: relative;
        }
        .pw-wrap .inp {
          padding-right: 2.5rem;
        }
        .eye {
          position: absolute;
          right: 0.72rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #444;
          cursor: pointer;
          display: flex;
          padding: 0;
        }
        .eye:hover {
          color: #aaa;
        }

        /* strength */
        .strength-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 5px;
        }
        .bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .bar {
          flex: 1;
          height: 3px;
          border-radius: 99px;
          transition: background 0.3s;
        }
        .strength-txt {
          font-size: 0.72rem;
          font-weight: 500;
          min-width: 34px;
          text-transform: none;
          letter-spacing: 0;
        }

        /* rules */
        .rules {
          list-style: none;
          padding: 0;
          margin: 4px 0 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .rules li {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          text-transform: none;
          letter-spacing: 0;
          font-weight: 400;
        }

        .mismatch {
          font-size: 0.72rem;
          color: #ef4444;
          text-transform: none;
          letter-spacing: 0;
          font-weight: 400;
        }

        /* terms */
        .terms-lbl {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 0.82rem;
          color: #888;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }
        .chk {
          margin-top: 2px;
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          accent-color: #0ea5e9;
          cursor: pointer;
        }
        .tlink {
          color: #7dd3fc;
          text-decoration: none;
        }
        .tlink:hover {
          text-decoration: underline;
        }

        /* submit */
        .submit {
          width: 100%;
          margin-top: 0.4rem;
          padding: 0.78rem 1rem;
          background: linear-gradient(135deg, #0ea5e9, #7c3aed);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition:
            opacity 0.2s,
            transform 0.15s,
            box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
        }
        .submit:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(14, 165, 233, 0.45);
        }
        .submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spin {
          animation: rot 0.75s linear infinite;
        }
        @keyframes rot {
          to {
            transform: rotate(360deg);
          }
        }

        .switch {
          text-align: center;
          font-size: 0.82rem;
          color: #555;
          margin-top: 1.5rem;
        }
        .switch :global(a) {
          color: #7dd3fc;
          font-weight: 500;
          text-decoration: none;
        }
        .switch :global(a:hover) {
          text-decoration: underline;
        }
      `}</style>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.017 17.64 11.71 17.64 9.2z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  )
}
