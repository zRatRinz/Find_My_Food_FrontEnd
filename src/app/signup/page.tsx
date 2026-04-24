"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Mail, ArrowRight, ChevronLeft, AlertCircle, CheckCircle2, Calendar, VenusAndMars } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRepository } from '@/infrastructure/user/UserRepository';

const userRepo = new UserRepository();

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birth_date: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await userRepo.createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        gender: formData.gender || null,
        birth_date: formData.birth_date || null,
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating your account');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0F0F0F] flex overflow-hidden font-sans selection:bg-blue-200 transition-colors duration-300">
      {/* --- LEFT SECTION: EDITORIAL VISUAL --- */}
      <div className="hidden lg:flex w-1/2 relative bg-luxury-surface/50 overflow-hidden border-r border-luxury-border">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1672934324490-0b8086f41414?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Culinary Art"
            className="w-full h-full object-cover opacity-90 dark:opacity-60"
          />
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
              Begin Your <br />
              <span className="not-italic font-black text-luxury-accent-start uppercase tracking-tighter block mt-2">Culinary Journey</span>
            </h1>
            <p className="mt-8 text-xl text-gray-800 dark:text-luxury-text-muted max-w-sm leading-relaxed font-light">
              Create an account to save your favorite inspirations and share your own masterpieces with the world.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-luxury-text-muted">
              <div className="flex flex-col gap-2">
                <span className="text-luxury-text">Exclusive</span>
                <span>Access</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-luxury-text">Personal</span>
                <span>Collection</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-luxury-text">Global</span>
                <span>Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SECTION: SIGN UP FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">

          <div className="bg-white dark:bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] border border-gray-300/50 dark:border-white/10 shadow-2xl shadow-gray-300/40 dark:shadow-2xl dark:shadow-luxury-accent-start/5 space-y-12">

            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-luxury-accent-start font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                <div className="w-6 h-[1px] bg-luxury-accent-start"></div>
                <span>Join the Community</span>
              </div>
              <h2 className="text-4xl font-serif text-luxury-text">Create Account</h2>
              <p className="text-luxury-text-muted font-light text-sm">Start your journey into the art of fine dining.</p>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-luxury-text">Welcome Aboard!</h3>
                  <p className="text-luxury-text-muted font-light text-sm">
                    Your account has been created successfully. Redirecting you to login...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  {/* Username Field */}
                  <div className="group relative">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-luxury-text-muted mb-2 group-focus-within:text-luxury-accent-start transition-colors duration-300">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-gray-600 group-focus-within:text-luxury-accent-start transition-colors duration-300" />
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-8 pr-4 py-4 bg-transparent border-b border-luxury-border focus:border-luxury-accent-start outline-none transition-all duration-300 text-luxury-text placeholder-gray-300 dark:placeholder-gray-600 font-light"
                        placeholder="Choose a unique username"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="group relative">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-luxury-text-muted mb-2 group-focus-within:text-luxury-accent-start transition-colors duration-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-gray-600 group-focus-within:text-luxury-accent-start transition-colors duration-300" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-8 pr-4 py-4 bg-transparent border-b border-luxury-border focus:border-luxury-accent-start outline-none transition-all duration-300 text-luxury-text placeholder-gray-300 dark:placeholder-gray-600 font-light"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="group relative">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-luxury-text-muted mb-2 group-focus-within:text-luxury-accent-start transition-colors duration-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-gray-600 group-focus-within:text-luxury-accent-start transition-colors duration-300" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-8 pr-12 py-4 bg-transparent border-b border-luxury-border focus:border-luxury-accent-start outline-none transition-all duration-300 text-luxury-text placeholder-gray-300 dark:placeholder-gray-600 font-light"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-300 dark:text-gray-600 hover:text-luxury-accent-start transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="group relative">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-luxury-text-muted mb-2 group-focus-within:text-luxury-accent-start transition-colors duration-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-gray-600 group-focus-within:text-luxury-accent-start transition-colors duration-300" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-8 pr-12 py-4 bg-transparent border-b border-luxury-border focus:border-luxury-accent-start outline-none transition-all duration-300 text-luxury-text placeholder-gray-300 dark:placeholder-gray-600 font-light"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-300 dark:text-gray-600 hover:text-luxury-accent-start transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Gender & Birth Date Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group relative">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-luxury-text-muted mb-2 group-focus-within:text-luxury-accent-start transition-colors duration-300">
                        Gender
                      </label>
                      <div className="relative">
                        <VenusAndMars className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-gray-600 group-focus-within:text-luxury-accent-start transition-colors duration-300" />
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full pl-8 pr-4 py-4 bg-transparent border-b border-luxury-border focus:border-luxury-accent-start outline-none transition-all duration-300 text-luxury-text dark:text-white placeholder-gray-300 dark:placeholder-gray-600 font-light appearance-none"
                        >
                          <option value="" className="text-gray-500 dark:bg-[#0F0F0F] dark:text-gray-400">Select Gender</option>
                          <option value="Male" className="text-luxury-text dark:bg-[#0F0F0F] dark:text-white">Male</option>
                          <option value="Female" className="text-luxury-text dark:bg-[#0F0F0F] dark:text-white">Female</option>
                          <option value="Other" className="text-luxury-text dark:bg-[#0F0F0F] dark:text-white">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="group relative">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-luxury-text-muted mb-2 group-focus-within:text-luxury-accent-start transition-colors duration-300">
                        Birth Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-gray-600 group-focus-within:text-luxury-accent-start transition-colors duration-300" />
                        <input
                          type="date"
                          value={formData.birth_date}
                          onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                          className="date-input w-full pl-8 pr-4 py-4 bg-transparent border-b border-luxury-border focus:border-luxury-accent-start outline-none transition-all duration-300 text-luxury-text dark:text-white placeholder-gray-300 dark:placeholder-gray-600 font-light"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-xl animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-400 leading-none mb-1">
                        Registration Error
                      </span>
                      <span className="text-xs font-medium text-red-600 dark:text-red-400 leading-relaxed">
                        {error}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden bg-luxury-gradient text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:opacity-90 hover:shadow-luxury-accent-start/40 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 shadow-2xl shadow-luxury-accent-start/20"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create My Account</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="text-center space-y-6">
              <p className="text-sm text-luxury-text-muted font-light">
                Already have an account?{' '}
                <Link href="/login" className="text-luxury-text font-bold hover:text-luxury-accent-start transition-colors underline underline-offset-4">
                  Sign In
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

      <style jsx global>{`
        .date-input {
          color-scheme: light !important;
        }
        html.dark .date-input, .dark .date-input {
          color-scheme: dark !important;
        }
      `}</style>
    </div>
  );
}
