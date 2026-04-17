"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="relative z-40 bg-gradient-to-b from-luxury-surface to-blue-50/30 dark:to-purple-900/20 border-t border-luxury-border py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left">
          <div className="text-2xl font-black tracking-tighter text-luxury-text mb-1">
            Find<span className="inline-block bg-gradient-to-br from-luxury-accent-start to-luxury-accent-end bg-clip-text text-transparent">My</span>Food
          </div>
          <p className="text-luxury-text-muted text-xs font-light max-w-xs">
            © 2026 Find My Food. Elevating the culinary experience through design and nutrition.
          </p>
        </div>
        <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-luxury-text-muted">
          <a href="#" className="hover:text-luxury-accent-start transition-colors">Privacy</a>
          <a href="#" className="hover:text-luxury-accent-start transition-colors">Terms</a>
          <a href="#" className="hover:text-luxury-accent-start transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
