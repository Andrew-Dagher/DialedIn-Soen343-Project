'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';

const tabs = [
  { name: 'Home', link: '/', icon: null },
  { name: 'Tracking', link: '/tracking' },
  { name: 'Get a Quote', link: '/Quotations' },
  { name: 'Ship Now', link: '/request-delivery' },
  { name: 'Login', link: '/api/auth/login', icon: <User className="h-4 w-4 text-violet-400" /> }
];

const tabsLoggedIn = [
  { name: 'Home', link: '/', icon: null },
  { name: 'Tracking', link: '/tracking' },
  { name: 'Get a Quote', link: '/Quotations' },
  { name: 'Ship Now', link: '/request-delivery' },
  { name: 'Log Out', a: '/api/auth/logout', icon: <User className="h-4 w-4 text-violet-400" /> }
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useUser();


  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group relative">
            <span className="text-xl font-bold text-white transition-colors group-hover:text-violet-400">DAILEDIN</span>
          </Link>

          {/* Desktop Menu */}
          {!isLoading&& user &&
          (<div className="hidden items-center gap-8 md:flex">
            {tabsLoggedIn.map(tab => {
              const isActive = pathname === tab.a;
              return (
                <a
                  href={tab.a}
                  key={tab.name}
                  className={`group relative hover:no-underline text-sm font-medium ${isActive ? 'text-violet-400' : 'text-gray-400'} `}>
                  <span className="relative z-10 flex items-center gap-2 transition-colors duration-200 group-hover:text-white">
                    {tab.icon && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10">
                        <User className="h-4 w-4 text-violet-400" />
                      </div>
                    )}
                    {tab.name}
                  </span>
                  {/* Active/Hover Indicator */}
                  <div
                    className={`absolute -bottom-1.5 left-0 h-0.5 transition-all duration-200 ease-out ${
                      isActive ? 'w-full bg-violet-400' : 'w-0 bg-gray-400 group-hover:w-full'
                    } `}
                  />
                </a>
              );
            })}
          </div>)}
          { !isLoading && !user &&(<div className="hidden items-center gap-8 md:flex">
            {tabs.map(tab => {
              const isActive = pathname === tab.link;
              return (
                <Link
                  href={tab.link}
                  key={tab.name}
                  className={`group relative hover:no-underline text-sm font-medium ${isActive ? 'text-violet-400' : 'text-gray-400'} `}>
                  <span className="relative z-10 flex items-center gap-2 transition-colors duration-200 group-hover:text-white">
                    {tab.icon && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10">
                        <User className="h-4 w-4 text-violet-400" />
                      </div>
                    )}
                    {tab.name}
                  </span>
                  {/* Active/Hover Indicator */}
                  <div
                    className={`absolute -bottom-1.5 left-0 h-0.5 transition-all duration-200 ease-out ${
                      isActive ? 'w-full bg-violet-400' : 'w-0 bg-gray-400 group-hover:w-full'
                    } `}
                  />
                </Link>
              );
            })}
          </div>
)}
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 text-gray-400 transition-colors hover:text-white md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full border-t border-gray-800/50 bg-slate-900/95 backdrop-blur-md md:hidden">
            <div className="space-y-1 px-2 py-4">
              {tabs.map(tab => {
                const isActive = pathname === tab.link;
                return (
                  <Link
                    href={tab.link}
                    key={tab.name}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-violet-400/10 text-violet-400'
                        : 'text-gray-400 hover:translate-x-2 hover:bg-gray-800/50 hover:text-white'
                    } `}>
                    {tab.icon && (
                      <div className="relative h-4 w-4">
                        <Image src={tab.icon} alt={`${tab.name} icon`} fill sizes="16px" className="object-contain" />
                      </div>
                    )}
                    {tab.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;