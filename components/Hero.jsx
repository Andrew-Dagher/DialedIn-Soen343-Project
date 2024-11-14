import React from 'react';
import Image from 'next/image';
import heroImage from '../public/hero-image.png';
import TrackingSearch from './TrackingSearch';
import shipNowIcon from '../public/ship-now-icon.svg';
import quoteIcon from '../public/quote-icon.svg';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="container mx-auto flex flex-col px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="flex flex-col-reverse gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          {/* Text Content */}
          <div className="flex flex-col space-y-6 text-center lg:w-1/2 lg:text-left">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-5xl">
              Global Shipping
              <br className="hidden sm:block" />
              <span className="mt-2 block sm:mt-3">The Way it Should Be</span>
            </h1>
            <p className="mx-auto max-w-lg text-base text-white/75 sm:text-lg lg:mx-0 lg:max-w-xl">
              We provide a seamless experience for all your shipping needs.
            </p>
          </div>

          {/* Hero Image */}
          <div className="lg:w-1/2">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg">
              <Image
                src={heroImage}
                alt="Hero Image"
                fill
                sizes="(max-width: 640px) 90vw, 
                       (max-width: 1024px) 70vw, 
                       45vw"
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Search */}
      <div className="my-8 sm:my-12 lg:mt-0">
        <TrackingSearch />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <Link
          href="/request-delivery"
          className="group flex items-center justify-center rounded-2xl 
                   bg-violet-400 px-6 py-4 sm:py-5
                   text-white transition-all duration-200 
                   hover:bg-violet-500 hover:no-underline 
                   hover:shadow-lg hover:shadow-violet-400/20
                   active:transform active:scale-95"
        >
          <span className="flex items-center justify-center gap-3">
            <div className="relative h-6 w-6 transition-transform duration-200 
                          group-hover:scale-110">
              <Image 
                src={shipNowIcon} 
                alt="Ship Now Icon" 
                fill 
                sizes="24px"
                className="object-contain" 
              />
            </div>
            <span className="text-base font-semibold tracking-wide sm:text-lg">
              SHIP NOW
            </span>
          </span>
        </Link>

        <Link
          href="/Quotations"
          className="group flex items-center justify-center rounded-2xl 
                   border-2 border-teal-200 px-6 py-4 sm:py-5
                   text-white transition-all duration-200 
                   hover:bg-teal-500 hover:no-underline 
                   hover:border-teal-500 hover:shadow-lg 
                   hover:shadow-teal-400/20
                   active:transform active:scale-95"
        >
          <span className="flex items-center justify-center gap-3">
            <div className="relative h-6 w-6 transition-transform duration-200 
                          group-hover:scale-110">
              <Image 
                src={quoteIcon} 
                alt="Get a Quote Icon" 
                fill 
                sizes="24px"
                className="object-contain" 
              />
            </div>
            <span className="text-base font-semibold tracking-wide sm:text-lg">
              GET A QUOTE
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Hero;