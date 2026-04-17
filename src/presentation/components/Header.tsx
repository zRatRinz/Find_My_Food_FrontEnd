"use client";

import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, LogOut, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useTheme } from '@/presentation/contexts/ThemeContext';

const Header = () => {
  const { user, isLoggedIn, logout, getProfileImage } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="bg-luxury-surface/80 backdrop-blur-md sticky top-0 z-40 border-b border-luxury-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-luxury-text cursor-pointer md:hidden" />
          <Link href="/" className="text-2xl font-black tracking-tighter text-luxury-text">
            Find<span className="text-orange-500">My</span>Food
          </Link>
        </div>

        {/* Refined Search Bar */}
        <div className="flex-grow relative max-w-xl hidden md:block">
          <input
            type="text"
            placeholder="Search for culinary inspiration..."
            className="w-full py-2.5 px-5 pr-12 bg-gray-100 dark:bg-gray-800 border-transparent rounded-full text-sm text-luxury-text focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-1 top-1 bottom-1 px-4 bg-gray-900 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-500 text-white rounded-full transition-all duration-300 shadow-sm"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full text-luxury-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 animate-in fade-in zoom-in duration-300" />
            ) : (
              <Moon className="w-5 h-5 animate-in fade-in zoom-in duration-300" />
            )}
          </button>

          <div className="relative cursor-pointer text-luxury-text hover:text-orange-500 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 rounded-full">
              0
            </span>
          </div>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* Profile Section */}
              <div className="relative">
                <div
                  className="group relative cursor-pointer"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500 to-yellow-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  <div className="relative w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden transition-transform duration-300 group-hover:scale-110">
                    <img
                      src={getProfileImage(user)}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Floating Identity Card */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-40 bg-luxury-surface/90 backdrop-blur-md border border-luxury-border rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 overflow-hidden">
                    <div className="p-3">
                      <div className="flex flex-col items-start space-y-2">
                        <h4 className="text-sm font-serif italic text-luxury-text truncate">
                          {user?.username || 'Guest User'}
                        </h4>

                        <div className="w-full border-t border-luxury-border pt-2">
                          <Link
                            href="/profile"
                            className="block text-[10px] font-bold text-luxury-text-muted hover:text-orange-500 transition-colors relative group py-1"
                          >
                            View Profile
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Elegant Divider */}
              <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-800"></div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-luxury-text hover:text-red-500 transition-colors border-b-2 border-transparent hover:border-red-500 pb-0.5 group"
              >
                <span>Logout</span>
                <LogOut className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-black uppercase tracking-widest text-luxury-text hover:text-orange-500 transition-colors border-b-2 border-transparent hover:border-orange-500 pb-0.5"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
