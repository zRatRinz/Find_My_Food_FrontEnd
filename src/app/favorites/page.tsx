"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Clock, User } from 'lucide-react';
import { UserRepository } from '@/infrastructure/user/UserRepository';
import { LikedRecipe } from '@/domain/recipe/LikedRecipe';

export default function FavoritesPage() {
  const [likedRecipes, setLikedRecipes] = useState<LikedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userRepo = new UserRepository();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const data = await userRepo.getUserLikedRecipes();
        setLikedRecipes(data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load your saved inspirations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="relative min-h-screen font-sans selection:bg-blue-200 overflow-hidden">
      {/* --- Atmospheric Blobs --- */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Page Header */}
        <div className="mb-16 space-y-4">
          <div className="flex items-center gap-3 text-red-500 mb-2">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-xs font-bold uppercase tracking-widest">My Collection</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter leading-tight">
            Saved <br />
            <span className="italic font-medium text-luxury-text-muted">Inspirations</span>
          </h1>
          <div className="w-24 h-1 bg-luxury-gradient rounded-full mt-6"></div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-serif italic text-red-500 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-luxury-text text-white rounded-full text-xs font-bold uppercase tracking-widest"
            >
              Retry
            </button>
          </div>
        ) : likedRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-luxury-accent-start/10 blur-2xl rounded-full"></div>
              <Heart className="relative w-20 h-20 text-luxury-text-muted opacity-20" />
            </div>
            
            <h2 className="text-2xl font-serif italic mb-4">
              Your curated gallery is currently empty
            </h2>
            <p className="max-w-md text-sm text-luxury-text-muted leading-relaxed mb-10">
              Explore our exquisite collection of recipes and save the ones that 
              speak to your culinary soul. Your personal archive of taste awaits.
            </p>

            <Link
              href="/"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-luxury-gradient text-white rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all duration-300 shadow-xl shadow-luxury-accent-start/20 hover:scale-105"
            >
              Discover Recipes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {likedRecipes.map((recipe) => (
              <Link 
                key={recipe.id} 
                href={`/recipe/${recipe.id}`}
                className="group relative bg-white dark:bg-gray-900 border border-luxury-border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                    <span className="text-[10px] font-bold text-luxury-text">{recipe.likeCount}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-serif font-bold text-luxury-text group-hover:text-luxury-accent-start transition-colors line-clamp-1">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center gap-1 text-luxury-text-muted shrink-0">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-medium">{recipe.cookingTimeMin}m</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-luxury-text-muted line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-luxury-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-luxury-gradient flex items-center justify-center text-[8px] text-white font-bold">
                        {(recipe.username || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[10px] font-medium text-luxury-text-muted">
                        by {recipe.username || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-luxury-accent-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                      View Detail <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
