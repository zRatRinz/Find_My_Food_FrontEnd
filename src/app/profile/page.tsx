"use client";

import React, { useState, useEffect } from 'react';
import { Mail, User as UserIcon, ArrowLeft, Calendar, VenusAndMars } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@/domain/user/User';
import { UserRepository } from '@/infrastructure/user/UserRepository';

const userRepo = new UserRepository();

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    const fetchUserInfo = async () => {
      try {
        const userData = await userRepo.getSimpleUserInfo();
        setUser(userData);
      } catch (error: any) {
        console.error('Profile fetch error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="animate-pulse text-luxury-text-muted font-serif italic">Loading identity...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-luxury-text-muted font-serif italic">User profile not found.</p>
          <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-orange-500 hover:underline">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  const getProfileImage = (user: User) => {
    if (user.image_url) return user.image_url;

    let gender = null;
    try {
      const storedUser = JSON.parse(localStorage.getItem('user_info') || '{}');
      gender = storedUser.gender;
    } catch (e) {
      console.error('Error reading gender from localStorage:', e);
    }

    const seed = encodeURIComponent(user.username);
    // เพิ่ม &mouth=smile เพื่อให้ Avatar ยิ้มแย้มเสมอ
    if (gender === 'Male') return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&gender=male&mouth=smile`;
    if (gender === 'Female') return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&gender=female&mouth=smile`;
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-orange-200">
      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-100/50 dark:bg-orange-900/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-50/50 dark:bg-yellow-900/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-16 md:py-24">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold text-luxury-text-muted hover:text-orange-500 transition-colors uppercase tracking-widest group mb-16"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Visual Identity */}
          <div className="lg:col-span-5 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="relative group">
              {/* Decorative Frame */}
              <div className="absolute -inset-4 border border-orange-200 dark:border-orange-900/30 rounded-2xl translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>

              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800">
                <img
                  src={getProfileImage(user!)}
                  alt={user.username}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <h1 className="text-5xl font-serif italic text-luxury-text leading-tight">
                {user.username}
              </h1>
              <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest">
                <div className="w-8 h-[1px] bg-orange-500"></div>
                <span>MEMBER</span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Information */}
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="space-y-12">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-luxury-text-muted mb-8 border-b border-luxury-border pb-2">
                  Personal Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {/* Username */}
                  <div className="group">
                    <div className="flex items-center gap-2 text-luxury-text-muted mb-1">
                      <UserIcon className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Username</span>
                    </div>
                    <p className="text-lg font-serif text-luxury-text group-hover:text-orange-600 transition-colors">
                      {user.username}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <div className="flex items-center gap-2 text-luxury-text-muted mb-1">
                      <Mail className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Email Address</span>
                    </div>
                    <p className="text-lg font-serif text-luxury-text group-hover:text-orange-600 transition-colors truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Gender */}
                  <div className="group">
                    <div className="flex items-center gap-2 text-luxury-text-muted mb-1">
                      <VenusAndMars className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Gender</span>
                    </div>
                    <p className="text-lg font-serif text-luxury-text group-hover:text-orange-600 transition-colors">
                      {(() => {
                        try {
                          const storedUser = JSON.parse(localStorage.getItem('user_info') || '{}');
                          return storedUser.gender || 'Not specified';
                        } catch {
                          return 'Not specified';
                        }
                      })()}
                    </p>
                  </div>

                  {/* Birth Date */}
                  <div className="group">
                    <div className="flex items-center gap-2 text-luxury-text-muted mb-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Birth Date</span>
                    </div>
                    <p className="text-lg font-serif text-luxury-text group-hover:text-orange-600 transition-colors">
                      Not specified
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="pt-8 flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-gray-900 dark:bg-orange-600 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-orange-500 transition-all duration-300 shadow-xl shadow-gray-900/20 dark:shadow-orange-900/20 active:scale-95">
                  Edit Profile
                </button>
                <button className="px-8 py-4 bg-transparent border border-luxury-border text-luxury-text-muted rounded-full text-xs font-bold uppercase tracking-widest hover:border-gray-400 hover:text-luxury-text transition-all duration-300 active:scale-95">
                  Account Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
