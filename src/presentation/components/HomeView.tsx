"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Star, Loader2, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Recipe } from '../../domain/recipe/Recipe';
import { RecipeRepository } from '../../infrastructure/recipe/RecipeRepository';
import { RecipeCard } from './RecipeCard';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const recipeApi = new RecipeRepository();

const HomeView = () => {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recommended, setRecommended] = useState<Recipe[]>([]);
  const [recommendedForYou, setRecommendedForYou] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRefStock = useRef<HTMLDivElement>(null);
  const scrollRefForYou = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { current } = ref;
      const scrollAmount = 280; // Card width (256) + gap (24)
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const query = searchParams.get('search');
      try {
        setIsLoading(true);
        setError(null);

        const [recipesData, recommendedData, recommendedForYouData] = await Promise.all([
          query ? recipeApi.getRecipesByName(query) : recipeApi.getAllRecipes(),
          recipeApi.getRecommendedRecipes(),
          recipeApi.getRecommendedRecipesForYou()
        ]);

        setRecipes(recipesData);
        setRecommended(recommendedData);
        setRecommendedForYou(recommendedForYouData);
      } catch (err: any) {
        setError(err.message || 'Failed to load recipes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  return (
    <div className="relative font-sans selection:bg-blue-200 overflow-hidden">
      {/* Atmospheric Blobs for Header/Footer Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* --- CATEGORY BAR --- */}
      <div className="bg-luxury-surface border-b border-luxury-border overflow-x-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-8 text-[10px] font-black uppercase tracking-widest text-luxury-text-muted whitespace-nowrap">
          {['All Recipes', 'Low Calorie', 'High Protein', 'Vegan', 'Thai Traditional', 'Desserts', 'Breakfast', 'Dinner'].map((cat) => (
            <a key={cat} href="#" className="hover:text-luxury-accent-start transition-colors relative group">
              {cat}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-accent-start transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Editorial Feature Banner */}
        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-16 group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            alt="Featured"
          />
          <div className="relative z-20 h-full flex flex-col justify-center px-12 text-white max-w-2xl">
            <div className="flex items-center gap-2 text-luxury-accent-start font-bold text-xs uppercase tracking-widest mb-4">
              <div className="w-6 h-[1px] bg-luxury-accent-start"></div>
              <span>Featured Story</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif italic leading-tight mb-6">
              The Art of <br />
              <span className="not-italic font-black uppercase tracking-tighter bg-luxury-gradient bg-clip-text text-transparent">Healthy Living</span>
            </h2>
            <p className="text-lg font-light text-gray-200 mb-8 max-w-md leading-relaxed">
              Explore our curated collection of nutrient-dense recipes designed to fuel your body and delight your senses.
            </p>
            <button className="w-fit px-8 py-4 bg-white text-gray-900 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-luxury-gradient hover:text-white transition-all duration-300 flex items-center gap-3 group">
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* --- RECOMMENDED SECTION (From Stock) --- */}
        {recommended.length > 0 && !isLoading && (
          <section className="mb-6 relative group/carousel">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-luxury-accent-start font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  <span>Personalized</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-luxury-text">Chef's Selection</h2>
              </div>
              <div className="hidden md:block w-24 h-[1px] bg-luxury-border"></div>
            </div>

            <div className="relative">
              {/* Navigation Arrows */}
              <button
                onClick={() => scroll(scrollRefStock, 'left')}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-lg text-luxury-text hover:text-luxury-accent-start transition-all duration-300 hover:scale-110 opacity-0 group-hover/carousel:opacity-100 border border-luxury-border"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll(scrollRefStock, 'right')}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-lg text-luxury-text hover:text-luxury-accent-start transition-all duration-300 hover:scale-110 opacity-0 group-hover/carousel:opacity-100 border border-luxury-border"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div
                ref={scrollRefStock}
                className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {recommended.map((recipe) => (
                  <div key={recipe.recipeId} className="snap-start shrink-0">
                    <RecipeCard recipe={recipe} variant="compact" />
                  </div>
                ))}
              </div>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
          </section>
        )}

        {/* --- RECOMMENDED SECTION (For You) --- */}
        {recommendedForYou.length > 0 && !isLoading && (
          <section className="mb-6 relative group/carousel">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-luxury-accent-start font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  <span>Curated for You</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-luxury-text">Your Taste Palette</h2>
              </div>
              <div className="hidden md:block w-24 h-[1px] bg-luxury-border"></div>
            </div>

            <div className="relative">
              {/* Navigation Arrows */}
              <button
                onClick={() => scroll(scrollRefForYou, 'left')}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-lg text-luxury-text hover:text-luxury-accent-start transition-all duration-300 hover:scale-110 opacity-0 group-hover/carousel:opacity-100 border border-luxury-border"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll(scrollRefForYou, 'right')}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-lg text-luxury-text hover:text-luxury-accent-start transition-all duration-300 hover:scale-110 opacity-0 group-hover/carousel:opacity-100 border border-luxury-border"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div
                ref={scrollRefForYou}
                className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {recommendedForYou.map((recipe) => (
                  <div key={recipe.recipeId} className="snap-start shrink-0">
                    <RecipeCard recipe={recipe} variant="compact" />
                  </div>
                ))}
              </div>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
          </section>
        )}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-luxury-accent-start animate-spin mb-4" />
            <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Curating Recipes...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 px-8 py-4 rounded-2xl font-medium mb-6 border border-red-100 dark:border-red-900/30">
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-luxury-accent-start font-bold hover:underline uppercase tracking-widest text-xs"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold text-luxury-text">All Recipes</h2>
              <div className="hidden md:block w-24 h-[1px] bg-luxury-border"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.recipeId} recipe={recipe} />
              ))}
              {recipes.length === 0 && (
                <div className="col-span-full text-center py-32 text-gray-400 font-light italic">
                  No recipes found in our archives.
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default HomeView;
