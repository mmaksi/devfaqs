import { SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Theme from './Theme';
import MobileNav from './MobileNav';
import GlobalSearch from '../search/Search';

const UserSettings = () => {
  return (
    <>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-10 w-10',
            },
            variables: {
              colorPrimary: '#FF7000',
            },
          }}
        />
      </SignedIn>
      <MobileNav />
    </>
  );
};

const Navbar = () => {
  return (
    <nav
      className='flex-between background-light900_dark200 
      fixed z-50 h-[6.25rem] w-full gap-5 p-6
      shadow-light-300 dark:shadow-none sm:px-12'
    >
      <Link href='/' className='flex items-center gap-1'>
        <Image
          src='/assets/images/site-logo.svg'
          width={23}
          height={23}
          alt='Logo'
        />
        <p
          className='h2-bold font-spaceGrotesk 
        text-dark-100 
        dark:text-light-900 max-sm:hidden'
        >
          Tech
          <span className='text-primary-500'>FAQs</span>
        </p>
      </Link>

      <GlobalSearch />

      <div className='flex-between gap-5'>
        <Theme />
        <UserSettings />
      </div>
    </nav>
  );
};

export default Navbar;
