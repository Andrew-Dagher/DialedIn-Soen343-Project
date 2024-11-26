'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Home, Package, DollarSign, Send, Box, LogOut, Gift, Tag } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';

const tabs = [
  {
    name: 'Home',
    link: '/',
    mobileIcon: <Home className="h-4 w-4 text-violet-400" />
  },
  {
    name: 'Tracking',
    link: '/tracking',
    mobileIcon: <Package className="h-4 w-4 text-violet-400" />
  },
  {
    name: 'Get a Quote',
    link: '/Quotations',
    mobileIcon: <DollarSign className="h-4 w-4 text-violet-400" />
  },
  {
    name: 'Ship Now',
    link: '/request-delivery',
    mobileIcon: <Send className="h-4 w-4 text-violet-400" />
  },
  
  {
    name: 'View My Points',
    link: '/view-my-points',
    mobileIcon: <Gift className="h-4 w-4 text-violet-400" />
  },
  {
    name: 'Purchase Coupons',
    link: '/purchase-coupons',
    mobileIcon: <Tag className="h-4 w-4 text-violet-400" />
  },
  {
    name: 'Login',
    link: '/api/auth/login',
    icon: <User className="h-4 w-4 text-violet-400" />,
    mobileIcon: <User className="h-4 w-4 text-violet-400" />
  }
];


const tabsLoggedIn = [
  {
    name: 'Home',
    link: '/',
    mobileIcon: <Home className="h-4 w-4 text-violet-400" />
  },
  {
    name: 'Tracking',
    link: '/tracking',
    mobileIcon: <Package className="h-4 w-4 text-violet-400" />
  },
  {
    name: 'Get a Quote',
    link: '/Quotations',
    mobileIcon: <DollarSign className="h-4 w-4 text-violet-400" />
  },
  {
    name: 'Ship Now',
    link: '/request-delivery',
    mobileIcon: <Send className="h-4 w-4 text-violet-400" />
  },
  {
    name: 'View your Deliveries',
    link: '/deliveries',
    mobileIcon: <Box className="h-4 w-4 text-violet-400" />
  },

  {
    name: 'View My Points',
    link: '/view-my-points',
    mobileIcon: <Gift className="h-4 w-4 text-violet-400" />
  },
  {
    name: 'Purchase Coupons',
    link: '/purchase-coupons',
    mobileIcon: <Tag className="h-4 w-4 text-violet-400" />
  },

  {
    name: 'Log Out',
    link: '/api/auth/logout',
    icon: <User className="h-4 w-4 text-violet-400" />,
    mobileIcon: <LogOut className="h-4 w-4 text-violet-400" />
  }
];


const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  const currentTabs = !isLoading && user ? tabsLoggedIn : tabs;

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group relative">
            <span className="text-xl font-bold text-white transition-colors group-hover:text-violet-400">DIALEDIN</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            {currentTabs.map(tab => {
              const isActive = pathname === tab.link;
              const Component = tab.name === 'Log Out' ? 'a' : Link;

              return (
                <Component
                  href={tab.link}
                  key={tab.name}
                  className={`group relative text-sm font-medium hover:no-underline ${isActive ? 'text-violet-400' : 'text-gray-400'}`}>
                  <span className="relative z-10 flex items-center gap-2 transition-colors duration-200 group-hover:text-white">
                    {tab.icon && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10">
                        {tab.icon}
                      </div>
                    )}
                    {tab.name}
                  </span>
                  {/* Active/Hover Indicator */}
                  {tab.name !== 'Log Out' && (
                    <div
                      className={`absolute -bottom-1.5 left-0 h-0.5 transition-all duration-200 ease-out ${
                        isActive ? 'w-full bg-violet-400' : 'w-0 bg-gray-400 group-hover:w-full'
                      }`}
                    />
                  )}
                </Component>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 text-gray-400 transition-colors hover:text-white md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Full Screen Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 top-20 z-50 bg-slate-950 md:hidden">
            <div className="flex flex-col space-y-2 p-4">
              {currentTabs.map(tab => {
                const isActive = pathname === tab.link;
                const Component = tab.name === 'Log Out' ? 'a' : Link;

                return (
                  <Component
                    href={tab.link}
                    key={tab.name}
                    onClick={() => setIsOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-xl p-4 text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-violet-400/10 text-violet-400 hover:text-white'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    } `}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10">
                      {tab.mobileIcon}
                    </div>
                    <span>{tab.name}</span>
                    {isActive && <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-violet-400" />}
                  </Component>
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
