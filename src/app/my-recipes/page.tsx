"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Clock, ChefHat } from 'lucide-react';
import { RecipeRepository } from '@/infrastructure/recipe/RecipeRepository';
import { Recipe } from '@/domain/recipe/Recipe';

export default function MyRecipesPage() {
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recipeRepo = new RecipeRepository();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        setIsLoading(true);
        const data = await recipeRepo.getMyCreatedRecipes();
        setMyRecipes(data);
      } catch (err: any) {
        console.error('Error fetching my recipes:', err);
        setError('Failed to load your creations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  return (
    <div className="relative min-h-screen font-sans selection:bg-blue-200 overflow-hidden">
      {/* --- Atmospheric Blobs (Synced with HomeView) --- */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Page Header */}
        <div className="mb-16 space-y-4">
          <div className="flex items-center gap-3 text-luxury-accent-start mb-2">
            <ChefHat className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">My Masterpieces</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter leading-tight">
            My <br />
            <span className="italic font-medium text-luxury-text-muted">Creations</span>
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
        ) : myRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-luxury-accent-start/10 blur-2xl rounded-full"></div>
              <div className="relative w-20 h-20 rounded-full bg-white dark:bg-gray-900 border border-luxury-border flex items-center justify-center shadow-sm">
                <Heart className="w-10 h-10 text-luxury-text-muted opacity-20" />
              </div>
            </div>
            
            <h2 className="text-2xl font-serif italic mb-4">
              You haven't created any recipes yet
            </h2>
            <p className="max-w-md text-sm text-luxury-text-muted leading-relaxed mb-10">
              Your culinary journey begins here. Share your secret ingredients 
              and inspire the world with your own unique masterpieces.
            </p>

            <Link
              href="/"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-luxury-gradient text-white rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all duration-300 shadow-xl shadow-luxury-accent-start/20 hover:scale-105"
            >
              Explore Inspirations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myRecipes.map((recipe) => (
              <Link 
                key={recipe.recipeId} 
                href={`/recipe/${recipe.recipeId}`}
                className="group relative bg-white dark:bg-gray-900 border border-luxury-border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={recipe.imageUrl || 'https://via.placeholder.com/500?text=No+Image'} 
                    alt={recipe.recipeName}
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
                      {recipe.recipeName}
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
                        {recipe.username?.charAt(0).toUpperCase() || 'U'}
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
