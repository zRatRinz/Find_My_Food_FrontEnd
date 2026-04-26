"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Heart, Star, User, ArrowRight, ShoppingBag } from 'lucide-react';
import { RecipeDetail } from '../../domain/recipe/Recipe';
import { RecipeRepository } from '../../infrastructure/recipe/RecipeRepository';
import { useToast } from '@/presentation/contexts/ToastContext';
import Link from 'next/link';
import IngredientPreviewModal from './IngredientPreviewModal';

const recipeApi = new RecipeRepository();

const RecipeDetailView = ({ recipeId }: { recipeId: number }) => {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { showToast } = useToast();

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

  const handleLikeToggle = async () => {
    if (!recipe) return;

    const previousLikeCount = recipe.likeCount;
    const previousIsLiked = recipe.isLiked;

    // Optimistic Update
    setRecipe({
      ...recipe,
      isLiked: !previousIsLiked,
      likeCount: previousIsLiked ? previousLikeCount - 1 : previousLikeCount + 1,
    });

    try {
      const result = previousIsLiked 
        ? await recipeApi.unlikeRecipe(recipeId) 
        : await recipeApi.likeRecipe(recipeId);

      // Sync with server result
      setRecipe({
        ...recipe,
        isLiked: result.isLiked,
        likeCount: result.likeCount,
      });
    } catch (err: any) {
      // Rollback on error
      setRecipe({
        ...recipe,
        isLiked: previousIsLiked,
        likeCount: previousLikeCount,
      });
      showToast(err.message || 'Something went wrong while updating like status', 'error');
    }
  };

  const handleAddToCart = () => {
    setIsPreviewOpen(true);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-luxury-text-muted font-medium tracking-widest uppercase text-xs">Loading culinary masterpiece...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-8 py-4 rounded-2xl font-medium mb-6 border border-red-100 dark:border-red-900/30">
          {error || 'Recipe not found'}
        </div>
        <Link href="/" className="text-orange-500 font-bold hover:underline uppercase tracking-widest text-xs">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-luxury-text font-sans selection:bg-blue-200 overflow-hidden">
      {/* Atmospheric Blobs for Header/Footer Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-luxury-text-muted hover:text-luxury-accent-start transition-colors group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          <span>Back to recipes</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative group">
            <div className="absolute -inset-4 bg-blue-200/30 dark:bg-blue-900/20 rounded-[2rem] blur-2xl group-hover:bg-blue-200/50 transition-all duration-500"></div>
            <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={recipe.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'}
                alt={recipe.recipeName}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute top-6 right-6">
                <button 
                  onClick={handleLikeToggle}
                  className={`p-4 rounded-full shadow-xl transition-all transform hover:scale-110 ${recipe.isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className={`w-6 h-6 ${recipe.isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-luxury-accent-start font-bold text-xs uppercase tracking-widest">
                <div className="w-6 h-[1px] bg-luxury-accent-start"></div>
                <span>Culinary Art</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif italic leading-[1.1] text-luxury-text">
                {recipe.recipeName}
              </h1>
              <p className="text-lg text-luxury-text-muted leading-relaxed font-light">
                {recipe.description || 'A delicious recipe crafted for health and taste.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-luxury-text-muted">Category</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.categoryDetails.map((cat, idx) => (
                    <span key={idx} className="text-xs font-bold text-luxury-accent-start bg-blue-50 dark:bg-blue-900/30 dark:text-luxury-accent-end px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/50">
                      {cat.tagName}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-luxury-text-muted">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.tagDetails.map((tag, idx) => (
                    <span key={idx} className="text-xs font-medium text-luxury-text-muted bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border border-luxury-border">
                      #{tag.tagName}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-luxury-text-muted font-medium text-sm">
              <User className="w-4 h-4" />
              <span>By {recipe.username || 'Anonymous Chef'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Information Bar */}
      <section className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-luxury-surface rounded-3xl p-8 shadow-sm border border-luxury-border">
          <div className="flex items-center justify-center gap-6 py-6 md:border-r border-luxury-border">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-luxury-accent-start">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase font-black text-luxury-text-muted tracking-widest">Cooking Time</p>
              <p className="text-3xl font-serif font-bold text-luxury-text">{recipe.cookingTimeMin} <span className="text-lg font-light text-luxury-text-muted">MINS</span></p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 py-6">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-2xl text-luxury-accent-end">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase font-black text-luxury-text-muted tracking-widest">Popularity</p>
              <p className="text-3xl font-serif font-bold text-luxury-text">{recipe.likeCount} <span className="text-lg font-light text-luxury-text-muted">LIKES</span></p>
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
                <div className="w-10 h-[2px] bg-luxury-accent-start"></div>
                <h2 className="text-3xl font-serif font-bold text-luxury-text">Ingredients</h2>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full bg-luxury-gradient text-white py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all duration-300 shadow-lg mb-10 group"
              >
                <ShoppingBag className="w-4 h-4 group-hover:animate-bounce" />
                Add All Ingredients to List
              </button>

              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-luxury-accent-start uppercase tracking-widest">Main Ingredients</h3>
                  <ul className="space-y-4">
                    {recipe.ingredients.filter(ing => ing.isMainIngredient).map((ing, idx) => (
                      <li key={`main-ing-${idx}`} className="flex justify-between items-center group py-2 border-b border-luxury-border">
                        <span className="text-lg font-medium text-luxury-text group-hover:text-luxury-accent-start transition-colors">{ing.ingredientName}</span>
                        <span className="text-sm font-bold text-luxury-text-muted bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                          {ing.quantity} {ing.unitName}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-luxury-text-muted uppercase tracking-widest">Other Ingredients</h3>
                  <ul className="space-y-4">
                    {recipe.ingredients.filter(ing => !ing.isMainIngredient).map((ing, idx) => (
                      <li key={`other-ing-${idx}`} className="flex justify-between items-center group py-2 border-b border-luxury-border">
                        <span className="text-lg font-medium text-luxury-text-muted group-hover:text-luxury-accent-start transition-colors">{ing.ingredientName}</span>
                        <span className="text-sm font-bold text-luxury-text-muted bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
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
                <div className="w-10 h-[2px] bg-luxury-accent-start"></div>
                <h2 className="text-3xl font-serif font-bold text-luxury-text">Cooking Steps</h2>
              </div>

              <div className="space-y-16">
                {recipe.steps.map((step, idx) => (
                  <div key={`step-${idx}`} className="flex gap-10 items-start group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-luxury-accent-start dark:text-luxury-accent-end flex items-center justify-center font-serif font-bold text-xl transition-all duration-300 group-hover:bg-luxury-gradient group-hover:text-white shadow-sm">
                      {step.stepNumber}
                    </div>
                    <div className="pt-2">
                      <p className="text-xl text-luxury-text-muted leading-relaxed font-light transition-colors duration-300 group-hover:text-luxury-text">
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

      <IngredientPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        recipeId={recipeId}
        recipeName={recipe?.recipeName || ''}
      />
    </div>
  );
}

export default RecipeDetailView;
