"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Star, Search, ShoppingCart, Menu, Loader2, ArrowRight, LogOut } from 'lucide-react';
import { Recipe } from '../../domain/Recipe';
import { RecipeRepository } from '../../infrastructure/repositories/RecipeRepository';
import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const recipeApi = new RecipeRepository();
const authApi = new AuthRepository();

const RecipeCard = ({ recipe, variant = 'standard' }: { recipe: Recipe, variant?: 'standard' | 'featured' }) => {
  return (
    <Link
      href={`/recipe/${recipe.recipeId}`}
      className="group bg-white rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 border border-gray-100 flex flex-col"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
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
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-all duration-300 shadow-sm hover:scale-110"
        >
          <Heart className={`w-4 h-4 ${recipe.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-serif font-bold text-gray-900 line-clamp-2 h-12 mb-2 leading-snug group-hover:text-orange-600 transition-colors">
          {recipe.recipeName}
        </h3>

        <div className="flex flex-wrap items-start gap-1.5 mb-4 h-10 overflow-hidden">
          {recipe.tags.slice(0, 5).map((tag, idx) => (
            <span key={idx} className="text-[9px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 leading-none">
              {tag}
            </span>
          ))}
          {recipe.tags.length > 5 && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 leading-none">...</span>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-500">{recipe.likeCount}</span>
          </div>
          {recipe.cookingTimeMin && (
            <span className="text-xs font-bold text-gray-900">{recipe.cookingTimeMin} min</span>
          )}
        </div>
      </div>
    </Link>
  );
};

const HomeView = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; image_url: string | null; gender: string | null } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      console.log('Checking auth status...');
      const token = localStorage.getItem('auth_token');
      const userInfo = localStorage.getItem('user_info');
      
      console.log('Token found:', !!token);
      console.log('UserInfo found:', !!userInfo);
      
      if (token && userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          console.log('User parsed successfully:', parsedUser.username);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (e) {
          console.error('Failed to parse user info:', e);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuth();

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

  const getProfileImage = (userData: any) => {
    if (userData?.image_url) return userData.image_url;
    const seed = encodeURIComponent(userData?.username || 'guest');
    if (userData?.gender === 'Male') return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&gender=male&mouth=smile`;
    if (userData?.gender === 'Female') return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&gender=female&mouth=smile`;
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
  };

  const handleLogout = () => {
    authApi.logout();
    setIsLoggedIn(false);
    router.push('/login');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
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
    <div className="min-h-screen bg-[#F9F7F2] font-sans selection:bg-orange-200">
      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 opacity-20 pointer-events-none z-50" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* --- EDITORIAL HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Menu className="w-6 h-6 text-gray-900 cursor-pointer md:hidden" />
            <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900">
              Find<span className="text-orange-500">My</span>Food
            </Link>
          </div>

          {/* Refined Search Bar */}
          <div className="flex-grow relative max-w-xl hidden md:block">
            <input
              type="text"
              placeholder="Search for culinary inspiration..."
              className="w-full py-2.5 px-5 pr-12 bg-gray-100 border-transparent rounded-full text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1 bottom-1 px-4 bg-gray-900 hover:bg-orange-600 text-white rounded-full transition-all duration-300 shadow-sm"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-gray-900 hover:text-orange-500 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 rounded-full">
                0
              </span>
            </div>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {/* Profile Section */}
                <div className="relative">
                  <div 
                    className="group relative cursor-pointer"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500 to-yellow-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    <div className="relative w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden transition-transform duration-300 group-hover:scale-110">
                      <img
                        src={getProfileImage(user)}
                        alt="User Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Floating Identity Card */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-40 bg-white/90 backdrop-blur-md border border-gray-100 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 overflow-hidden">
                      <div className="p-3">
                        <div className="flex flex-col items-start space-y-2">
                          <h4 className="text-sm font-serif italic text-gray-900 truncate">
                            {user?.username || 'Guest User'}
                          </h4>
                          
                          <div className="w-full border-t border-gray-100 pt-2">
                            <Link 
                              href="/profile" 
                              className="block text-[10px] font-bold text-gray-500 hover:text-orange-500 transition-colors relative group py-1"
                            >
                              View Profile
                              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Elegant Divider */}
                <div className="w-[1px] h-4 bg-gray-200"></div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-red-500 transition-colors border-b-2 border-transparent hover:border-red-500 pb-0.5 group"
                >
                  <span>Logout</span>
                  <LogOut className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="text-xs font-black uppercase tracking-widest text-gray-900 hover:text-orange-500 transition-colors border-b-2 border-transparent hover:border-orange-500 pb-0.5"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* --- CATEGORY BAR --- */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
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
            <div className="bg-red-50 text-red-500 px-8 py-4 rounded-2xl font-medium mb-6 border border-red-100">
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

      {/* --- EDITORIAL FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left">
            <div className="text-2xl font-black tracking-tighter text-gray-900 mb-2">
              Find<span className="text-orange-500">My</span>Food
            </div>
            <p className="text-gray-400 text-xs font-light max-w-xs">
              © 2026 Find My Food. Elevating the culinary experience through design and nutrition.
            </p>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeView;
