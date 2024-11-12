import React from 'react';
import Image from 'next/image';
import Button from './Button';
import searchIcon from '../public/search-icon.svg';

const TrackingSearch = () => {
  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-0">
      <div className="relative flex h-12 flex-1 items-center rounded-xl bg-white sm:h-14">
        <div className="relative ml-4 h-6 w-6">
          <Image src={searchIcon} alt="Search Icon" fill sizes="24px" className="object-contain" />
        </div>
        <input
          type="text"
          placeholder="Enter tracking number"
          className="flex-1 rounded-xl bg-transparent px-4 text-sm outline-none sm:text-base"
          aria-label="Tracking number input"
        />
        <Button
          name="Track"
          className=" rounded-xl bg-violet-400 text-sm font-medium text-white transition-colors hover:bg-violet-600 sm:h-14 sm:px-12 sm:text-base"
        />
      </div>
    </div>
  );
};

export default TrackingSearch;
