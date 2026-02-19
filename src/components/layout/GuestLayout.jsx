import React from 'react';
import GuestHeader from './GuestHeader';
import Footer from './Footer';

export default function GuestLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <GuestHeader />
      <main>{children}</main>
      <Footer />
    </div>
  );
}