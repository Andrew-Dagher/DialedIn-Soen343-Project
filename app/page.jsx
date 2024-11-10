'use client';

import React from 'react';

import Hero from '../components/Hero';
import Content from '../components/Content';
import Chat from '../components/Chat';

export default function Index() {
  return (
    <>
      <Hero />
      <hr />
      <Chat />
      <Content />
    </>
  );
}
