"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Star, Search, ShoppingCart, Menu, Loader2 } from 'lucide-react';
import { Recipe } from '../../domain/Recipe';
import { RecipeRepository } from '../../infrastructure/repositories/RecipeRepository';
import Link from 'next/link';

const recipeApi = new RecipeRepository();

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Link 
      href={`/recipe/${recipe.recipeId}`} 
      className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.02] border border-gray-200 overflow-hidden flex flex-col"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-200">
        <img
          src={recipe.imageUrl || 'https://via.placeholder.com/500?text=No+Image'}
          alt={recipe.recipeName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button 
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation when clicking like
            // Like logic would go here
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"
        >
          <Heart className={`w-4 h-4 ${recipe.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-2 flex flex-col flex-grow">
        {/* Name */}
        <h3 className="text-sm text-gray-800 line-clamp-2 h-10 mb-1 leading-tight group-hover:text-orange-500 transition-colors">
          {recipe.recipeName}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap items-start gap-1 mb-2 h-10 overflow-hidden">
          {recipe.tags.slice(0, 4).map((tag, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-500 text-[10px] px-1 rounded uppercase font-medium">
              {tag}
            </span>
          ))}
          {recipe.tags.length > 4 && (
            <span className="bg-gray-100 text-gray-500 text-[10px] px-1 rounded uppercase font-medium">
              ...
            </span>
          )}
        </div>

        <div className="mt-auto">
          {/* Rating/Likes */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center text-yellow-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-medium text-gray-600 ml-0.5">
                {recipe.likeCount}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">likes</span>
          </div>

          {/* Calories (Price Position) - Using cooking time as a placeholder */}
          <div className="flex items-baseline gap-1">
            {recipe.cookingTimeMin && (
              <span className="text-orange-500 font-bold text-base">{recipe.cookingTimeMin} min</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const HomeView = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const data = await recipeApi.getAllRecipes();
        setRecipes(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load recipes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If search is empty, go back to all recipes
      try {
        setIsLoading(true);
        const data = await recipeApi.getAllRecipes();
        setRecipes(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load recipes');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await recipeApi.getRecipesByName(searchQuery.trim());
      setRecipes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to search recipes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* --- SHOPEE STYLE HEADER --- */}
      <header className="bg-orange-500 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSearchQuery(''); handleSearch(); }}>
            <Menu className="w-6 h-6 md:hidden" />
            <div className="text-2xl font-bold tracking-tight">FindMyFood</div>
          </div>

          {/* Search Bar */}
          <div className="flex-grow relative max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search for healthy recipes..."
              className="w-full py-2 px-4 pr-12 rounded-sm text-gray-800 bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              className="absolute right-1 top-1 bottom-1 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-sm transition-colors shadow-sm"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="relative cursor-pointer">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-[10px] font-bold px-1.5 rounded-full border border-orange-500">
                0
              </span>
            </div>
            <div className="text-sm font-medium cursor-pointer hover:underline">Login</div>
          </div>
        </div>
      </header>

      {/* --- CATEGORY BAR --- */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-6 text-xs font-medium text-gray-600 whitespace-nowrap">
          {['All Recipes', 'Low Calorie', 'High Protein', 'Vegan', 'Thai Traditional', 'Desserts', 'Breakfast', 'Dinner'].map((cat) => (
            <a key={cat} href="#" className="hover:text-orange-500 transition-colors uppercase tracking-wider">{cat}</a>
          ))}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Banner Section */}
        <div className="w-full h-40 md:h-64 bg-gradient-to-r from-orange-400 to-yellow-300 rounded-sm mb-8 flex items-center justify-center text-white text-center p-6 shadow-sm">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-2 drop-shadow-md">HEALTHY EATING SALE!</h2>
            <p className="text-sm md:text-lg font-medium opacity-90">Discover 1000+ recipes to transform your body</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading delicious recipes...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-red-100 text-red-600 px-6 py-3 rounded-lg font-medium mb-4">
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="text-orange-500 font-bold hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.recipeId} recipe={recipe} />
            ))}
            {recipes.length === 0 && (
              <div className="col-span-full text-center py-24 text-gray-500">
                No recipes found.
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-gray-400 text-sm mb-4">© 2026 Find My Food - Your Health, Your Choice</div>
          <div className="flex justify-center gap-6 text-xs text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-orange-500">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500">Terms of Service</a>
            <a href="#" className="hover:text-orange-500">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeView;
