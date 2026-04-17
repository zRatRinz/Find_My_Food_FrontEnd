"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-left">
          <div className="text-2xl font-black tracking-tighter text-gray-900 mb-2">
            Find<span className="text-orange-500">My</span>Food
          </div>
          <p className="text-gray-400 text-xs font-light max-w-xs">
            © 2026 Find My Food. Elevating the culinary experience through design and nutrition.
          </p>
        </div>
        <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
