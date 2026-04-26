"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Star, Loader2, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Filter, X, Zap } from 'lucide-react';
import { Recipe } from '../../domain/recipe/Recipe';
import { RecipeRepository } from '../../infrastructure/recipe/RecipeRepository';
import { RecipeCard } from './RecipeCard';
import { RecipeFilterBar } from './RecipeFilterBar';
import { FilterDrawer } from './FilterDrawer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const recipeApi = new RecipeRepository();

const HomeView = () => {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [genZRecipes, setGenZRecipes] = useState<Recipe[]>([]);
  const [recommended, setRecommended] = useState<Recipe[]>([]);
  const [recommendedForYou, setRecommendedForYou] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Applied Filter States (Triggers API)
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  
  // Temp states for Drawer (Draft mode - doesn't trigger API until Apply)
  const [tempCategories, setTempCategories] = useState<number[]>([]);
  const [tempTags, setTempTags] = useState<number[]>([]);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const scrollRefStock = useRef<HTMLDivElement>(null);
  const scrollRefForYou = useRef<HTMLDivElement>(null);
  const scrollRefGenZ = useRef<HTMLDivElement>(null);

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

  const fetchAllRecipes = async (cats = selectedCategories, tgs = selectedTags) => {
    const query = searchParams.get('search');
    try {
      setIsFiltering(true);
      let data: Recipe[] = [];
      let genZData: Recipe[] = [];
      
      if (cats.length > 0 || tgs.length > 0) {
        const result = await recipeApi.getRecipesByFilters(cats, tgs);
        data = result.recipes;
        genZData = result.genZRecipes;
      } else if (query) {
        data = await recipeApi.getRecipesByName(query);
      } else {
        data = await recipeApi.getAllRecipes();
      }
      
      setRecipes(data);
      setGenZRecipes(genZData);
    } catch (err: any) {
      console.error('Fetch all recipes error:', err);
      setError(err.message || 'Failed to load recipes');
    } finally {
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch filter options and initial recipes in parallel
        const [filterOptions, recommendedData, recommendedForYouData] = await Promise.all([
          recipeApi.getFilterOptions(),
          recipeApi.getRecommendedRecipes(),
          recipeApi.getRecommendedRecipesForYou()
        ]);

        setCategories(filterOptions.categories);
        setTags(filterOptions.tags);
        setRecommended(recommendedData);
        setRecommendedForYou(recommendedForYouData);
        
        // Initial fetch for All Recipes
        await fetchAllRecipes();
      } catch (err: any) {
        setError(err.message || 'Failed to load recipes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Re-fetch when applied filters change
  useEffect(() => {
    fetchAllRecipes(selectedCategories, selectedTags);
  }, [selectedCategories, selectedTags]);

  // Handlers for Quick Filter Bar (Immediate)
  const handleToggleCategory = (id: number) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleToggleTag = (id: number) => {
    setSelectedTags(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  // Handlers for Filter Drawer (Draft)
  const handleTempToggleCategory = (id: number) => {
    setTempCategories(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleTempToggleTag = (id: number) => {
    setTempTags(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  const openFilterDrawer = () => {
    // Sync temp states with current applied filters before opening
    setTempCategories([...selectedCategories]);
    setTempTags([...selectedTags]);
    setIsDrawerOpen(true);
  };

  const applyDrawerFilters = () => {
    // Commit temp states to applied states
    setSelectedCategories(tempCategories);
    setSelectedTags(tempTags);
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative font-sans selection:bg-blue-200 overflow-hidden">
      {/* Atmospheric Blobs for Header/Footer Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* --- CATEGORY BAR (Static/Decorative) --- */}
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
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-serif font-bold text-luxury-text">All Recipes</h2>
                {selectedCategories.length > 0 || selectedTags.length > 0 ? (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-500">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-text-muted">Filtering by:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCategories.map(id => {
                        const cat = categories.find(c => c.id === id);
                        return cat ? (
                          <span key={id} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-luxury-accent-start/10 text-luxury-accent-start border border-luxury-accent-start/20">
                            {cat.name}
                          </span>
                        ) : null;
                      })}
                      {selectedTags.map(id => {
                        const tag = tags.find(t => t.id === id);
                        return tag ? (
                          <span key={id} className="text-[10px] font-serif italic px-2 py-0.5 rounded-full bg-luxury-accent-start/10 text-luxury-accent-start border border-luxury-accent-start/20">
                            {tag.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <button 
                      onClick={clearAllFilters}
                      className="text-[10px] font-bold uppercase tracking-widest text-luxury-text-muted hover:text-luxury-accent-start transition-colors flex items-center gap-1 ml-2"
                    >
                      <X className="w-2 h-2" /> Clear All
                    </button>
                  </div>
                ) : (
                  <div className="h-4" />
                )}
              </div>
              <button
                onClick={openFilterDrawer}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-luxury-border rounded-full text-[10px] font-bold uppercase tracking-widest text-luxury-text hover:border-luxury-accent-start transition-all duration-300 shadow-sm"
              >
                <Filter className="w-3 h-3" />
                Filter
              </button>
            </div>

            {/* --- GEN Z RECOMMENDED CAROUSEL (Embedded in All Recipes) --- */}
            {genZRecipes.length > 0 && (
              <section className="mb-12 relative group/carousel animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-luxury-accent-start font-bold text-xs uppercase tracking-widest">
                      <Zap className="w-3 h-3" />
                      <span>Trending Now</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-luxury-text">Gen Z's Choice</h3>
                  </div>
                  <div className="hidden md:block w-16 h-[1px] bg-luxury-border"></div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => scroll(scrollRefGenZ, 'left')}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-lg text-luxury-text hover:text-luxury-accent-start transition-all duration-300 hover:scale-110 opacity-0 group-hover/carousel:opacity-100 border border-luxury-border"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scroll(scrollRefGenZ, 'right')}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-lg text-luxury-text hover:text-luxury-accent-start transition-all duration-300 hover:scale-110 opacity-0 group-hover/carousel:opacity-100 border border-luxury-border"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div
                    ref={scrollRefGenZ}
                    className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
                    style={{
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    {genZRecipes.map((recipe) => (
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

            {isFiltering ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-luxury-surface animate-pulse rounded-xl border border-luxury-border" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {(() => {
                  // Merge Gen Z recipes to the top, removing duplicates from the main list
                  const genZIds = new Set(genZRecipes.map(r => r.recipeId));
                  const filteredMainRecipes = recipes.filter(r => !genZIds.has(r.recipeId));
                  const combined = [...genZRecipes, ...filteredMainRecipes];
                  
                  return combined.map((recipe) => (
                    <RecipeCard key={recipe.recipeId} recipe={recipe} />
                  ));
                })()}
                {recipes.length === 0 && genZRecipes.length === 0 && (
                  <div className="col-span-full text-center py-32 text-gray-400 font-light italic">
                    No recipes found in our archives.
                  </div>
                )}
              </div>
            )}

            <FilterDrawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              categories={categories}
              tags={tags}
              selectedCategories={tempCategories}
              selectedTags={tempTags}
              onToggleCategory={handleTempToggleCategory}
              onToggleTag={handleTempToggleTag}
              onApply={applyDrawerFilters}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default HomeView;
