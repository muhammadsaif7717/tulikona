import { Suspense } from 'react'
import SignInPage from '@/components/root/SignInPage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignInPage />
    </Suspense>
  )
}
