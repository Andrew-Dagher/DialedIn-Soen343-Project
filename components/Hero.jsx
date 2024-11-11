import React from 'react';
import Image from 'next/image';
import heroImage from '../public/hero-image.png';
import TrackingSearch from './TrackingSearch';
import shipNowIcon from '../public/ship-now-icon.svg';
import quoteIcon from '../public/quote-icon.svg';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="my-20 flex flex-col p-10">
      <div className="align-items-center mx-10 mb-20 flex justify-between">
        <div className="flex flex-col gap-6">
          <h1 className="text-white">
            Global Shipping<br></br>The Way it Should Be
          </h1>
          <p className="text-white opacity-75">We provide a seamless experience for all your shipping needs.</p>
        </div>
        <Image src={heroImage} />
      </div>
      <TrackingSearch />
      <div className="flex justify-between">
        <Link
          href="/ShipNow"
          className="m-10 flex h-24 w-2/5 items-center justify-center rounded-2xl bg-violet-400 px-4 text-white hover:bg-violet-700 hover:no-underline">
          <span className="flex items-center justify-center gap-2">
            <Image src={shipNowIcon} alt="Ship Now Icon" width={24} height={24} />
            SHIP NOW
          </span>
        </Link>
        <Link
          href="/Quotations"
          className="m-10 flex w-2/5 items-center justify-center rounded-2xl border-2 border-teal-200 px-4 text-white hover:bg-teal-600 hover:no-underline">
          <span className="flex items-center justify-center gap-2">
            <Image src={quoteIcon} alt="Get a Quote Icon" width={24} height={24} />
            GET A QUOTE
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
