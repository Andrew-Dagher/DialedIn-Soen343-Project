import React from 'react';
import Image from 'next/image';
import Button from './Button';

import searchIcon from '../public/search-icon.svg';

const TrackingSearch = () => {
  return (
    <div className="mx-10 flex h-12 rounded-xl bg-white">
      <Image src={searchIcon} className="ml-4 w-8" />
      <input type="text" placeholder="Enter tracking number" className="flex-1 px-4 outline-none" />
      <Button name="Track" className="m-1 rounded-xl bg-violet-400 px-4 text-white hover:bg-violet-300"></Button>
    </div>
  );
};

export default TrackingSearch;
