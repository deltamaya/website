'use client'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import LogoDark from '@/data/logo-dark.svg'
import LogoLight from '@/data/logo-light.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { useTheme } from 'next-themes'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-gray-100 dark:bg-stone-950 justify-between '
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }
  const { theme, setTheme, resolvedTheme } = useTheme()
  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle} className={'ml-5'}>
        <div className=" flex w-full items-center justify-between ">
          <div className="mr-3">{resolvedTheme === 'light' ? <LogoDark /> : <LogoLight />}</div>
          <div className="hidden h-6 text-2xl font-semibold sm:block">
            {siteMetadata.headerTitle}
          </div>
        </div>
      </Link>
      <div className="mr-10 flex items-center space-x-4 leading-5 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="block font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
