"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, ArrowRight, ChevronLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthRepository } from '@/infrastructure/auth/AuthRepository';

const authApi = new AuthRepository();

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(username, password);
      
      // บันทึกทั้ง Token และ ข้อมูลผู้ใช้
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_info', JSON.stringify(response.data));
      
      // ใช้ window.location.href เพื่อ Force Reload หน้า Home ให้ดึงข้อมูลล่าสุดจาก localStorage
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0F0F0F] flex overflow-hidden font-sans selection:bg-blue-200 transition-colors duration-300">
      {/* --- LEFT SECTION: EDITORIAL VISUAL --- */}
      <div className="hidden lg:flex w-1/2 relative bg-luxury-surface/50 overflow-hidden border-r border-luxury-border">
        
        {/* High-End Thai Culinary Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1722995690313-9ef561d30143?q=80&w=1974&auto=format&fit=crop"
            alt="Luxury Thai Cuisine"
            className="w-full h-full object-cover opacity-90 dark:opacity-60"
          />
          {/* Gradient Overlay - Removed 'via' to eliminate the foggy/fuzzy effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7] to-transparent dark:from-[#0F0F0F] dark:to-transparent"></div>
        </div>

        <div className="relative z-20 w-full h-full flex flex-col justify-between p-16">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <Link href="/" className="inline-block mb-12">
              <span className="text-2xl font-black tracking-tighter text-luxury-text">
                Find<span className="text-luxury-accent-start">My</span>Food
              </span>
            </Link>

            <h1 className="text-7xl md:text-8xl font-serif italic leading-[1] text-luxury-text max-w-md">
              Savor the <br />
              <span className="not-italic font-black text-luxury-accent-start uppercase tracking-tighter block mt-2">Art of Taste</span>
            </h1>
            <p className="mt-8 text-xl text-gray-800 dark:text-luxury-text-muted max-w-sm leading-relaxed font-light">
              Join our community of culinary enthusiasts and discover recipes that inspire your soul.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-luxury-text-muted">
              <div className="flex flex-col gap-2">
                <span className="text-luxury-text">Curated</span>
                <span>Recipes</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-luxury-text">Expert</span>
                <span>Guides</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-luxury-text">Healthy</span>
                <span>Living</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SECTION: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
          
          {/* Luxury Form Card */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] border border-gray-300/50 dark:border-white/10 shadow-2xl shadow-gray-300/40 dark:shadow-2xl dark:shadow-luxury-accent-start/5 space-y-12">
            
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-luxury-accent-start font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                <div className="w-6 h-[1px] bg-luxury-accent-start"></div>
                <span>Authentication</span>
              </div>
              <h2 className="text-4xl font-serif text-luxury-text">Welcome Back</h2>
              <p className="text-luxury-text-muted font-light text-sm">Enter your credentials to access your kitchen.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* Username or Email Field */}
                <div className="group relative">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-luxury-text-muted mb-2 group-focus-within:text-luxury-accent-start transition-colors">
                    Username or Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-gray-600 group-focus-within:text-luxury-accent-start transition-colors" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-8 pr-4 py-4 bg-transparent border-b border-luxury-border focus:border-luxury-accent-start outline-none transition-all text-luxury-text placeholder-gray-300 dark:placeholder-gray-600 font-light"
                      placeholder="Enter username or email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="group relative">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-luxury-text-muted group-focus-within:text-luxury-accent-start transition-colors">
                      Password
                    </label>
                    <a href="#" className="text-[10px] font-bold text-luxury-accent-start hover:text-luxury-accent-end transition-colors uppercase tracking-tighter">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-gray-600 group-focus-within:text-luxury-accent-start transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-8 pr-12 py-4 bg-transparent border-b border-luxury-border focus:border-luxury-accent-start outline-none transition-all text-luxury-text placeholder-gray-300 dark:placeholder-gray-600 font-light"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-300 dark:text-gray-600 hover:text-luxury-accent-start transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-xl animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400 leading-none mb-1">
                      Authentication Error
                    </span>
                    <span className="text-xs font-medium text-red-700 dark:text-red-400 leading-relaxed">
                      {error}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden bg-luxury-gradient text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 shadow-2xl shadow-luxury-accent-start/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center space-y-6">
              <p className="text-sm text-luxury-text-muted font-light">
                New to the community?{' '}
                <Link href="#" className="text-luxury-text font-bold hover:text-luxury-accent-start transition-colors underline underline-offset-4">
                  Create an account
                </Link>
              </p>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[10px] font-bold text-luxury-text-muted hover:text-luxury-accent-start transition-colors uppercase tracking-widest group"
              >
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
