"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, ArrowRight, ChevronLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository';

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
      const data = await authApi.login(username, password);
      localStorage.setItem('auth_token', data.access_token);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex overflow-hidden font-sans selection:bg-orange-200">
      {/* --- LEFT SECTION: EDITORIAL VISUAL --- */}
      <div className="hidden lg:flex w-1/2 relative bg-[#F2EFE6] overflow-hidden border-r border-gray-200">
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>

        {/* Decorative Gradient Mesh */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-100/50 rounded-full blur-3xl"></div>

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <Link href="/" className="inline-block mb-12">
              <span className="text-2xl font-black tracking-tighter text-gray-900">
                Find<span className="text-orange-500">My</span>Food
              </span>
            </Link>
            
            <h1 className="text-7xl font-serif italic leading-[1.1] text-gray-900 max-w-md">
              Savor the <br />
              <span className="not-italic font-black text-orange-500 uppercase tracking-tighter">Art of Taste</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-sm leading-relaxed font-light">
              Join our community of culinary enthusiasts and discover recipes that inspire your soul.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
              <div className="flex flex-col gap-2">
                <span className="text-gray-900">Curated</span>
                <span>Recipes</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-900">Expert</span>
                <span>Guides</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-900">Healthy</span>
                <span>Living</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SECTION: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">
              <div className="w-8 h-[1px] bg-orange-500"></div>
              <span>Authentication</span>
            </div>
            <h2 className="text-4xl font-serif text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 font-light">Enter your credentials to access your kitchen.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Username or Email Field */}
              <div className="group relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-orange-500 transition-colors">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-8 pr-4 py-4 bg-transparent border-b-2 border-gray-200 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder-gray-300 font-light"
                    placeholder="Enter username or email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group relative">
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-orange-500 transition-colors">
                    Password
                  </label>
                  <a href="#" className="text-[10px] font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-tighter">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-12 py-4 bg-transparent border-b-2 border-gray-200 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder-gray-300 font-light"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-50/50 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-xl animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400 leading-none mb-1">
                    Authentication Error
                  </span>
                  <span className="text-xs font-medium text-red-700 leading-relaxed">
                    {error}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full overflow-hidden bg-gray-900 text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:bg-orange-500 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 shadow-2xl shadow-gray-900/20"
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
            <p className="text-sm text-gray-500 font-light">
              New to the community?{' '}
              <Link href="#" className="text-gray-900 font-bold hover:text-orange-500 transition-colors underline underline-offset-4">
                Create an account
              </Link>
            </p>
            
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest group"
            >
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
