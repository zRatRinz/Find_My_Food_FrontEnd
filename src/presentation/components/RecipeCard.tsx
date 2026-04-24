"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Recipe } from '@/domain/recipe/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
  variant?: 'standard' | 'compact' | 'horizontal';
}

export const RecipeCard = ({ recipe, variant = 'standard' }: RecipeCardProps) => {
  return (
    <Link
      href={`/recipe/${recipe.recipeId}`}
      className={`group bg-luxury-surface rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-luxury-accent-start/10 border border-luxury-border shadow-sm dark:shadow-none hover:border-luxury-accent-start/30 dark:hover:border-luxury-accent-start/50 flex ${
        variant === 'horizontal' ? 'flex-row h-40' : `flex-col ${variant === 'compact' ? 'w-64' : 'w-full'}`
      }`}
    >
      {/* Image Section */}
      <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${
        variant === 'horizontal' ? 'w-48 h-full' : variant === 'compact' ? 'aspect-square' : 'aspect-[4/5]'
      }`}>
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
      <div className={`p-4 flex flex-col flex-grow ${
        variant === 'horizontal' ? 'justify-between' : variant === 'compact' ? 'py-3' : ''
      }`}>
        <div>
          <h3 className={`font-serif font-bold text-luxury-text line-clamp-2 mb-2 leading-snug group-hover:text-luxury-accent-start transition-colors ${
            variant === 'horizontal' ? 'text-lg h-14' : variant === 'compact' ? 'text-sm h-10' : 'text-base h-12'
          }`}>
            {recipe.recipeName}
          </h3>

          <div className={`flex flex-wrap items-start gap-1.5 mb-4 overflow-hidden ${variant === 'horizontal' ? 'h-auto' : 'h-10'}`}>
            {recipe.tags.slice(0, 5).map((tag, idx) => (
              <span key={idx} className="text-[9px] font-bold uppercase tracking-wider text-luxury-accent-start dark:text-luxury-accent-end bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/30 leading-none">
                {tag}
              </span>
            ))}
            {recipe.tags.length > 5 && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-luxury-text-muted bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-luxury-border leading-none">...</span>
            )}
          </div>
        </div>

        <div className={`pt-3 border-t border-luxury-border flex items-center justify-between ${variant === 'horizontal' ? 'mt-auto' : ''}`}>
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
