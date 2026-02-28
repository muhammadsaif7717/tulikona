'use client'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { FiHeart, FiSearch } from 'react-icons/fi'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Menu, Search, X } from 'lucide-react'
import { useSearch } from '@/hooks/useSearch'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathName = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { search, setSearch } = useSearch()
  const [inputValue, setInputValue] = useState('')

  const isDashboard = pathName.startsWith('/dashboard')
  const isAuth = pathName.startsWith('/auth')
  if (isAuth || isDashboard) return null

  const handleSearch = () => {
    setSearch(inputValue)
  }

  console.log(search)
  return (
    <>
      <nav className="fixed z-50 w-full">
        <div className="bg-cfg backdrop-blur-[10px]">
          <div className="mx-auto max-w-screen-2xl p-2">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-1">
                <Image
                  src={'/logo-bg.png'}
                  height={1920}
                  width={1920}
                  alt="logo"
                  className="h-10 w-20 rounded-xl lg:h-16 lg:w-28"
                />
                <h1 className="text-center">তুলিকনা</h1>
              </div>

              {/* Desktop Search */}
              <div className="hidden w-full justify-center lg:flex">
                <div className="relative flex w-1/2 items-center justify-center">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch()
                    }}
                    className="focus:border-cprimary h-12 border-transparent bg-[#f8f8f8] p-5 pr-28 placeholder:text-[16px]"
                    placeholder="Keyword here..."
                  />
                  <Button
                    variant={'ghost'}
                    className="absolute right-5 flex cursor-pointer gap-2 hover:bg-transparent"
                    onClick={handleSearch}
                  >
                    <FiSearch className="text-2xl" />
                    <span className="font-semibold">Search</span>
                  </Button>
                </div>
              </div>

              {/* Desktop Nav Buttons */}
              <div className="hidden gap-6 lg:flex">
                <Popover>
                  <PopoverTrigger asChild>
                    {session ? (
                      <div className="flex cursor-pointer items-center justify-center gap-5 rounded-full bg-blue-200 p-[3px] hover:bg-blue-300">
                        {session.user?.image ? (
                          <Image
                            height={500}
                            width={500}
                            src={session.user.image}
                            alt="Profile"
                            className="w-10 rounded-full"
                          />
                        ) : (
                          <Image
                            height={500}
                            width={500}
                            src={'https://i.ibb.co.com/sdt0MY22/download.png'}
                            alt="Profile"
                            className="w-10 rounded-full"
                          />
                        )}
                      </div>
                    ) : (
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger
                            asChild
                            className="flex items-center justify-center"
                          >
                            <Link href={'/auth/sign-in'}>
                              <LogIn className="scale-[1.2]" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="bg-cprimary text-cfg"
                          >
                            <p className="text-[16px]">Login</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </PopoverTrigger>
                  <PopoverContent align="center">
                    {session && (
                      <div className="space-y-3">
                        <p className="text-[16px]">{session?.user?.name}</p>
                        <div className="flex gap-2">
                          <Link href={`/dashboard/orders`}>
                            <Button variant={'sidebar'} className="w-auto">
                              Dashboard
                            </Button>
                          </Link>
                          <Button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            variant={'destructive'}
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FiHeart className="text-3xl" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-cprimary text-cfg"
                    >
                      <p className="text-[16px]">Favourites</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HiOutlineShoppingCart className="text-3xl" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-cprimary text-cfg"
                    >
                      <p className="text-[16px]">Cart</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Mobile: Hamburger Button */}
              <button
                className="flex items-center justify-center lg:hidden"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="text-2xl" />
                ) : (
                  <Menu className="text-2xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="rounded-2xl bg-gray-100 shadow-lg lg:hidden">
            <div className="mx-auto max-w-screen-2xl space-y-4 px-4 py-4">
              {/* Mobile Search */}
              <div className="relative flex items-center">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                      setMenuOpen(false)
                    }
                  }}
                  className="focus:border-cprimary h-11 w-full border-transparent bg-white p-4 pr-24 placeholder:text-[15px]"
                  placeholder="Keyword here..."
                />
                <Button
                  variant="ghost"
                  className="absolute right-3 flex cursor-pointer gap-1 hover:bg-transparent"
                  onClick={() => {
                    handleSearch()
                    setMenuOpen(false)
                  }}
                >
                  <Search />
                </Button>
              </div>

              {/* Mobile Menu Items */}
              <div className="flex flex-col gap-1">
                {/* Favourites */}
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/')
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-200"
                >
                  <FiHeart className="text-xl" />
                  <span className="text-[15px]">Favourites</span>
                </button>

                {/* Cart */}
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/')
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-200"
                >
                  <HiOutlineShoppingCart className="text-xl" />
                  <span className="text-[15px]">Cart</span>
                </button>

                {/* Login / Profile */}
                {session ? (
                  <div className="space-y-2 border-t pt-3">
                    <div className="flex items-center gap-3 px-3">
                      {session.user?.image && (
                        <Image
                          height={500}
                          width={500}
                          src={session.user.image}
                          alt="Profile"
                          className="w-9 rounded-full"
                        />
                      )}
                      <p className="text-[15px] font-medium">
                        {session?.user?.name}
                      </p>
                    </div>
                    <div className="flex gap-2 px-3">
                      <Link
                        href={`/dashboard/orders`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Button variant={'sidebar'} className="w-auto">
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        variant={'destructive'}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={'/auth/sign-in'}
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-200"
                  >
                    <LogIn className="text-xl" />
                    <span className="text-[15px]">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
