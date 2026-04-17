"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Heart, Star, User, ArrowRight } from 'lucide-react';
import { RecipeDetail } from '../../domain/recipe/Recipe';
import { RecipeRepository } from '../../infrastructure/recipe/RecipeRepository';
import Link from 'next/link';

const recipeApi = new RecipeRepository();

const RecipeDetailView = ({ recipeId }: { recipeId: number }) => {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const data = await recipeApi.getRecipeById(recipeId);
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load recipe details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [recipeId]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F7F2]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Loading culinary masterpiece...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F7F2] text-center">
        <div className="bg-red-50 text-red-600 px-8 py-4 rounded-2xl font-medium mb-6 border border-red-100">
          {error || 'Recipe not found'}
        </div>
        <Link href="/" className="text-orange-500 font-bold hover:underline uppercase tracking-widest text-xs">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-gray-900 font-sans selection:bg-orange-200">
      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 opacity-20 pointer-events-none z-50" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-colors group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          <span>Back to recipes</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative group">
            <div className="absolute -inset-4 bg-orange-200/30 rounded-[2rem] blur-2xl group-hover:bg-orange-200/50 transition-all duration-500"></div>
            <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={recipe.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'}
                alt={recipe.recipeName}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute top-6 right-6">
                <button className={`p-4 rounded-full shadow-xl transition-all transform hover:scale-110 ${recipe.isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}>
                  <Heart className={`w-6 h-6 ${recipe.isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 lg:pl-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest">
                <div className="w-6 h-[1px] bg-orange-500"></div>
                <span>Culinary Art</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif italic leading-[1.1] text-gray-900">
                {recipe.recipeName}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                {recipe.description || 'A delicious recipe crafted for health and taste.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.categoryDetails.map((cat, idx) => (
                    <span key={idx} className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                      {cat.tagName}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.tagDetails.map((tag, idx) => (
                    <span key={idx} className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                      #{tag.tagName}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-400 font-medium text-sm">
              <User className="w-4 h-4" />
              <span>By {recipe.username || 'Anonymous Chef'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Information Bar */}
      <section className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-center gap-6 py-6 md:border-r border-gray-100">
            <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Cooking Time</p>
              <p className="text-3xl font-serif font-bold text-gray-900">{recipe.cookingTimeMin} <span className="text-lg font-light text-gray-500">MINS</span></p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 py-6">
            <div className="p-3 bg-yellow-50 rounded-2xl text-yellow-500">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Popularity</p>
              <p className="text-3xl font-serif font-bold text-gray-900">{recipe.likeCount} <span className="text-lg font-light text-gray-500">LIKES</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Ingredients - Left Column */}
          <div className="lg:col-span-5 space-y-16">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-[2px] bg-orange-500"></div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Ingredients</h2>
              </div>

              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest">Main Ingredients</h3>
                  <ul className="space-y-4">
                    {recipe.ingredients.filter(ing => ing.isMainIngredient).map((ing, idx) => (
                      <li key={`main-ing-${idx}`} className="flex justify-between items-center group py-2 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-800 group-hover:text-orange-500 transition-colors">{ing.ingredientName}</span>
                        <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {ing.quantity} {ing.unitName}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Other Ingredients</h3>
                  <ul className="space-y-4">
                    {recipe.ingredients.filter(ing => !ing.isMainIngredient).map((ing, idx) => (
                      <li key={`other-ing-${idx}`} className="flex justify-between items-center group py-2 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-600 group-hover:text-orange-500 transition-colors">{ing.ingredientName}</span>
                        <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {ing.quantity} {ing.unitName}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Steps - Right Column */}
          <div className="lg:col-span-7 space-y-16">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-[2px] bg-orange-500"></div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Cooking Steps</h2>
              </div>

              <div className="space-y-16">
                {recipe.steps.map((step, idx) => (
                  <div key={`step-${idx}`} className="flex gap-10 items-start group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-serif font-bold text-xl transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white shadow-sm">
                      {step.stepNumber}
                    </div>
                    <div className="pt-2">
                      <p className="text-xl text-gray-700 leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecipeDetailView;
