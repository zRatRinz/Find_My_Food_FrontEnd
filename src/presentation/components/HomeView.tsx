"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Star, Loader2, ArrowRight } from 'lucide-react';
import { Recipe } from '../../domain/recipe/Recipe';
import { RecipeRepository } from '../../infrastructure/recipe/RecipeRepository';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const recipeApi = new RecipeRepository();

const RecipeCard = ({ recipe, variant = 'standard' }: { recipe: Recipe, variant?: 'standard' | 'featured' }) => {
  return (
    <Link
      href={`/recipe/${recipe.recipeId}`}
      className="group bg-luxury-surface rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 border border-luxury-border shadow-sm dark:shadow-none hover:border-orange-200 dark:hover:border-orange-900 flex flex-col"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={recipe.imageUrl || 'https://via.placeholder.com/500?text=No+Image'}
          alt={recipe.recipeName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <button
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-all duration-300 shadow-sm hover:scale-110"
        >
          <Heart className={`w-4 h-4 ${recipe.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-serif font-bold text-luxury-text line-clamp-2 h-12 mb-2 leading-snug group-hover:text-orange-600 transition-colors">
          {recipe.recipeName}
        </h3>

        <div className="flex flex-wrap items-start gap-1.5 mb-4 h-10 overflow-hidden">
          {recipe.tags.slice(0, 5).map((tag, idx) => (
            <span key={idx} className="text-[9px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded border border-orange-100 dark:border-orange-900/30 leading-none">
              {tag}
            </span>
          ))}
          {recipe.tags.length > 5 && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-luxury-text-muted bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-luxury-border leading-none">...</span>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-luxury-border flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-luxury-text-muted">{recipe.likeCount}</span>
          </div>
          {recipe.cookingTimeMin && (
            <span className="text-xs font-bold text-luxury-text">{recipe.cookingTimeMin} min</span>
          )}
        </div>
      </div>
    </Link>
  );
};

const HomeView = () => {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      const query = searchParams.get('search');
      try {
        setIsLoading(true);
        setError(null);
        
        if (query) {
          const data = await recipeApi.getRecipesByName(query);
          setRecipes(data);
        } else {
          const data = await recipeApi.getAllRecipes();
          setRecipes(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load recipes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [searchParams]);

  return (
    <div className="font-sans selection:bg-orange-200">
      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 opacity-20 pointer-events-none z-50"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* --- CATEGORY BAR --- */}
      <div className="bg-luxury-surface border-b border-luxury-border overflow-x-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-8 text-[10px] font-black uppercase tracking-widest text-luxury-text-muted whitespace-nowrap">
          {['All Recipes', 'Low Calorie', 'High Protein', 'Vegan', 'Thai Traditional', 'Desserts', 'Breakfast', 'Dinner'].map((cat) => (
            <a key={cat} href="#" className="hover:text-orange-500 transition-colors relative group">
              {cat}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
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
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-widest mb-4">
              <div className="w-6 h-[1px] bg-orange-400"></div>
              <span>Featured Story</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif italic leading-tight mb-6">
              The Art of <br />
              <span className="not-italic font-black uppercase tracking-tighter text-orange-500">Healthy Living</span>
            </h2>
            <p className="text-lg font-light text-gray-200 mb-8 max-w-md leading-relaxed">
              Explore our curated collection of nutrient-dense recipes designed to fuel your body and delight your senses.
            </p>
            <button className="w-fit px-8 py-4 bg-white text-gray-900 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center gap-3 group">
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Curating Recipes...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 px-8 py-4 rounded-2xl font-medium mb-6 border border-red-100 dark:border-red-900/30">
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-orange-500 font-bold hover:underline uppercase tracking-widest text-xs"
            >
              Try Again
            </button>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default HomeView;
