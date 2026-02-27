'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { CiLocationOn, CiMail } from 'react-icons/ci'
import { IoCallOutline } from 'react-icons/io5'
import { FaFacebook } from 'react-icons/fa'
import { IoLogoWhatsapp } from 'react-icons/io'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathName = usePathname()
  const isDashboard = pathName.startsWith('/dashboard')
  const isAuth = pathName.startsWith('/auth')
  if (isAuth || isDashboard) {
    return null
  }
  return (
    <>
      <footer className="mt-14 w-full space-y-2 bg-[#f8f8f8]">
        <hr />

        <div className="mx-auto flex max-w-screen-2xl flex-col justify-between gap-3 p-2 md:flex-row">
          <div className="flex w-full flex-row items-center justify-between md:w-3/5 md:flex-col md:items-start">
            <div className="space-y-2">
              <Image
                src={`/logo-bg.png`}
                height={1920}
                width={1920}
                alt="logo"
                className="h-12 w-24 rounded-xl lg:h-20 lg:w-32"
              />
              <p className="text-sm text-gray-600 md:text-lg">
                Honesty is our blood.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:gap-5">
              <Image
                src={`https://i.ibb.co.com/fYG24qQb/android.png`}
                height={1920}
                width={1920}
                alt="logo"
                className="w-28 scale-75 md:scale-100 lg:w-36"
              />
              <Image
                src={`https://i.ibb.co.com/Q3Vx39Nw/apple.png`}
                height={1920}
                width={1920}
                alt="logo"
                className="w-28 scale-75 md:scale-100 lg:w-36"
              />
            </div>
          </div>
          <hr className="block md:hidden" />
          <div className="flex w-full gap-5">
            <div className="w-full space-y-4">
              <h1 className="font-semibold md:text-lg lg:text-xl">
                Contact Us
              </h1>
              <div className="space-y-2">
                <div className="flex items-center justify-start gap-2 text-gray-600">
                  <CiLocationOn className="font-semibold md:text-2xl" />
                  <span className="text-sm md:text-lg">Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CiMail className="font-semibold md:text-xl" />
                  <Link
                    href={`mailto:muhammadsaif7717@gmail.com`}
                    className="text-sm md:text-lg"
                  >
                    saif.dev77@gmail.com
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <IoCallOutline className="font-semibold md:text-xl" />
                  <span className="text-sm md:text-lg">(+880) 1572900381</span>
                </div>
                <div className="flex gap-5">
                  <Link href={`/`} className="text-gray-600">
                    <FaFacebook className="text-2xl lg:text-[33px]" />
                  </Link>
                  <Link href={`/`} className="text-gray-600">
                    <IoLogoWhatsapp className="text-2xl lg:text-[33px]" />
                  </Link>
                  <Link href={`/`} className="text-gray-600">
                    <IoLogoWhatsapp className="text-2xl lg:text-[33px]" />
                  </Link>
                  <Link href={`/`} className="text-gray-600">
                    <IoLogoWhatsapp className="text-2xl lg:text-[33px]" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <h1 className="block font-semibold md:text-lg lg:hidden lg:text-xl">
                Newslatter
              </h1>
              <h1 className="hidden font-semibold md:text-lg lg:block lg:text-xl">
                Subscribe to Newslatter
              </h1>
              <Input type="email" placeholder="Your email" />
              <Button
                size={'sm'}
                variant={'destructive'}
                className="w-2/4 text-xs lg:text-lg"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <hr />
        <div className="w-full bg-[#f8f8f8] text-gray-600">
          <div className="mx-auto flex max-w-screen-2xl justify-center gap-2 p-2 lg:justify-between">
            <div>
              <p className="text-[11px] lg:text-[16px]">
                Copyright &copy; all rights reserved.
              </p>
            </div>
            <div>
              <p className="text-[11px] lg:text-[16px]">
                Developed by &ndash;{' '}
                <Link
                  target="_blank"
                  href={`http://developer-saif.vercel.app`}
                  className="italic"
                >
                  Muhammad Saif
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
