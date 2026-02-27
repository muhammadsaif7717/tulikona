'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [error, setError] = useState('')

  /* Map NextAuth error codes → readable messages */
  const friendlyError = (msg: string) => {
    if (msg.includes('Invalid email or password'))
      return 'Invalid email or password.'
    if (msg.includes('Use Google'))
      return 'This account uses Google sign-in. Please continue with Google.'
    return 'Something went wrong. Please try again.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      isSignUp: 'false',
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError(friendlyError(res.error))
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  const handleGoogle = async () => {
    setGLoading(true)
    await signIn('google', { callbackUrl })
  }

  return (
    <main className="root">
      {/* background */}
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

        <h1 className="title">Sign in</h1>
        <p className="sub">Welcome back — good to see you again.</p>

        {/* google */}
        <button
          onClick={handleGoogle}
          disabled={gLoading}
          className="oauth-btn"
        >
          {gLoading ? <Loader2 size={17} className="spin" /> : <GoogleIcon />}
          Continue with Google
        </button>

        <div className="sep">
          <span>or</span>
        </div>

        {error && <div className="err">{error}</div>}

        <form onSubmit={handleSubmit} className="form" noValidate>
          <label className="lbl">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inp"
            />
          </label>

          <label className="lbl">
            <span className="lbl-row">
              Password
              <Link href="/auth/forgot-password" className="fgt">
                Forgot password?
              </Link>
            </span>
            <div className="pw-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="inp"
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPw((p) => !p)}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </label>

          <button type="submit" disabled={loading} className="submit">
            {loading ? (
              <Loader2 size={16} className="spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <p className="switch">
          No account? <Link href="/auth/sign-up">Create one</Link>
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
          opacity: 0.55;
        }
        .b1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #7c3aed55, transparent 70%);
          top: -150px;
          right: -150px;
          animation: float 16s ease-in-out infinite alternate;
        }
        .b2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #db277755, transparent 70%);
          bottom: -100px;
          left: -100px;
          animation: float 12s ease-in-out infinite alternate-reverse;
        }
        @keyframes float {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(30px, 20px) scale(1.06);
          }
        }

        /* card */
        .card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
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

        /* brand */
        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          margin-bottom: 2rem;
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
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.3rem;
        }
        .sub {
          font-size: 0.85rem;
          color: #888;
          margin: 0 0 1.8rem;
          font-weight: 300;
        }

        /* google */
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

        /* separator */
        .sep {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 1.4rem 0;
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

        /* error */
        .err {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          font-size: 0.82rem;
          border-radius: 10px;
          padding: 0.6rem 0.9rem;
          margin-bottom: 1.2rem;
        }

        /* form */
        .form {
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
        }

        .lbl {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 500;
          color: #aaa;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .lbl-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .fgt {
          font-size: 0.75rem;
          color: #a78bfa;
          text-decoration: none;
          text-transform: none;
          letter-spacing: 0;
          font-weight: 400;
        }
        .fgt:hover {
          text-decoration: underline;
        }

        .inp {
          width: 100%;
          padding: 0.7rem 0.9rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #f0f0f0;
          font-family: 'Outfit', sans-serif;
          font-size: 0.92rem;
          outline: none;
          transition:
            border-color 0.2s,
            background 0.2s;
          box-sizing: border-box;
        }
        .inp::placeholder {
          color: #444;
        }
        .inp:focus {
          border-color: #7c3aed;
          background: rgba(124, 58, 237, 0.08);
        }

        .pw-wrap {
          position: relative;
        }
        .pw-wrap .inp {
          padding-right: 2.6rem;
        }
        .eye {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #555;
          cursor: pointer;
          display: flex;
          padding: 0;
        }
        .eye:hover {
          color: #aaa;
        }

        .submit {
          margin-top: 0.4rem;
          width: 100%;
          padding: 0.78rem 1rem;
          background: linear-gradient(135deg, #7c3aed, #db2777);
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
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.35);
        }
        .submit:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(124, 58, 237, 0.5);
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
          margin-top: 1.6rem;
        }
        .switch :global(a) {
          color: #a78bfa;
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
