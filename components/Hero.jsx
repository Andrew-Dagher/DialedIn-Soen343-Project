import React from 'react';
import Image from 'next/image';
import heroImage from '../public/hero-image.png';
import TrackingSearch from './TrackingSearch';
import shipNowIcon from '../public/ship-now-icon.svg';
import quoteIcon from '../public/quote-icon.svg';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="flex flex-col p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Hero Section */}
      <div className="mb-10 flex flex-col items-center justify-between gap-8 md:mb-20 md:flex-row">
        {/* Text Content */}
        <div className="flex w-full flex-col gap-6 text-center md:w-1/2 md:text-left">
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Global Shipping
            <br />
            The Way it Should Be
          </h1>
          <p className="text-sm text-white opacity-75 sm:text-base">
            We provide a seamless experience for all your shipping needs.
          </p>
        </div>
        {/* Hero Image */}
        <div className="flex w-full justify-center md:w-1/2">
          <div className="relative aspect-[4/3] w-full max-w-md">
            <Image
              src={heroImage}
              alt="Hero Image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Tracking Search */}
      <TrackingSearch />

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row">
        <Link
          href="/request-delivery"
          className="flex w-full items-center justify-center rounded-2xl bg-violet-400 px-4 py-6 text-white transition-colors hover:bg-violet-700 hover:no-underline sm:w-1/2">
          <span className="flex items-center justify-center gap-2">
            <div className="relative h-6 w-6">
              <Image src={shipNowIcon} alt="Ship Now Icon" fill sizes="24px" />
            </div>
            <span className="font-semibold">SHIP NOW</span>
          </span>
        </Link>
        <Link
          href="/Quotations"
          className="flex w-full items-center justify-center rounded-2xl border-2 border-teal-200 px-4 py-6 text-white transition-colors hover:bg-teal-600 hover:no-underline sm:w-1/2">
          <span className="flex items-center justify-center gap-2">
            <div className="relative h-6 w-6">
              <Image src={quoteIcon} alt="Get a Quote Icon" fill sizes="24px" />
            </div>
            <span className="font-semibold">GET A QUOTE</span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
