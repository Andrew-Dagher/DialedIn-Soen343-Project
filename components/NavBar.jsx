import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import loginIcon from '../public/login-icon.svg';

const tabs = [
  { name: 'home', link: '/' },
  { name: 'tracking', link: '/tracking' },
  { name: 'quotation', link: '/Quotations' },
  { name: 'shipping', link: '/request-delivery' },
  { name: 'login', link: '/login', logo: loginIcon }
];

const NavBar = () => {
  return (
    <>
      <nav className="mx-60 mt-5 flex justify-between">
        <div>
          <Link href="/" className="font-bold text-white hover:no-underline">
            DAILEDIN
          </Link>
        </div>
        <div className="flex gap-10">
          {tabs.map(tab => {
            return (
              <Link href={tab.link} key={tab.name} className={'flex items-center gap-1 text-white'}>
                {tab.name}
                {tab.logo && <Image src={tab.logo} alt={`${tab.name} icon`} width={20} height={20} />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
