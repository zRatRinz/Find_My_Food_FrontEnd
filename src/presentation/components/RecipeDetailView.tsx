"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Heart, Star, User, Utensils, ListChecks } from 'lucide-react';
import { RecipeDetail } from '../../domain/Recipe';
import { RecipeRepository } from '../../infrastructure/repositories/RecipeRepository';
import Link from 'next/link';

const recipeApi = new RecipeRepository();

const RecipeDetailView = ({ recipeId }: { recipeId: number }) => {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F7F2]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading recipe details...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F7F2] text-center">
        <div className="bg-red-100 text-red-600 px-6 py-3 rounded-lg font-medium mb-4">
          {error || 'Recipe not found'}
        </div>
        <Link href="/" className="text-orange-500 font-bold hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-orange-500 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to recipes</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
          <div className="lg:col-span-6 relative h-[40vh] lg:h-[50vh] overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={recipe.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'}
              alt={recipe.recipeName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6">
              <button className={`p-4 rounded-full shadow-xl transition-all transform hover:scale-110 ${recipe.isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}>
                <Heart className={`w-6 h-6 ${recipe.isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          <div className="lg:col-span-6 lg:pl-12 mt-8 lg:mt-0">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter uppercase mb-8">
              {recipe.recipeName}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
              {recipe.description || 'A delicious recipe crafted for health and taste.'}
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="space-y-2">
                <p className="text-xs uppercase font-black text-gray-400 tracking-widest">Category</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.categoryDetails.map((cat, idx) => (
                    <span key={idx} className="text-sm font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-lg">
                      {cat.tagName}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase font-black text-gray-400 tracking-widest">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.tagDetails.map((tag, idx) => (
                    <span key={idx} className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-lg">
                      #{tag.tagName}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-widest text-xs">
              <User className="w-4 h-4" />
              <span>By {recipe.username || 'Anonymous Chef'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Information Bar */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 border-t-4 border-b-4 border-black bg-white shadow-sm">
          <div className="flex items-center justify-center gap-4 py-6 border-b-2 md:border-b-0 md:border-r-2 border-black">
            <Clock className="w-6 h-6 text-orange-500" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Cooking Time</p>
              <p className="text-2xl font-black">{recipe.cookingTimeMin} MINS</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 py-6">
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Popularity</p>
              <p className="text-2xl font-black">{recipe.likeCount} LIKES</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Ingredients - Left Column */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-1 bg-orange-500"></div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Ingredients</h2>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest">Main Ingredients</h3>
                  <ul className="space-y-3">
                    {recipe.ingredients.filter(ing => ing.isMainIngredient).map((ing, idx) => (
                      <li key={`main-ing-${idx}`} className="flex justify-between items-center group">
                        <span className="text-lg font-medium text-gray-800 group-hover:text-orange-500 transition-colors">{ing.ingredientName}</span>
                        <span className="text-sm font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {ing.quantity} {ing.unitName}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Other Ingredients</h3>
                  <ul className="space-y-3">
                    {recipe.ingredients.filter(ing => !ing.isMainIngredient).map((ing, idx) => (
                      <li key={`other-ing-${idx}`} className="flex justify-between items-center group">
                        <span className="text-lg font-medium text-gray-600 group-hover:text-orange-500 transition-colors">{ing.ingredientName}</span>
                        <span className="text-sm font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
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
          <div className="lg:col-span-7 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-1 bg-orange-500"></div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Cooking Steps</h2>
              </div>
              
              <div className="space-y-12">
                {recipe.steps.map((step, idx) => (
                  <div key={`step-${idx}`} className="flex gap-8 items-start group">
                    <div className="flex-shrink-0 text-6xl font-black text-orange-500 opacity-30 group-hover:opacity-100 transition-opacity leading-none">
                      {step.stepNumber}
                    </div>
                    <div className="pt-2">
                      <p className="text-xl text-gray-700 leading-relaxed font-medium">
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
