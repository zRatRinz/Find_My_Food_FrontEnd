"use client";

import React, { useState, useEffect } from 'react';
import { RecipeRepository } from '@/infrastructure/recipe/RecipeRepository';
import { RecipeFilterBar } from '@/presentation/components/RecipeFilterBar';
import { FilterDrawer } from '@/presentation/components/FilterDrawer';
import { RecipeCard } from '@/presentation/components/RecipeCard';
import { Recipe } from '@/domain/recipe/Recipe';
import { Filter, Loader2, UtensilsCrossed } from 'lucide-react';

const recipeRepo = new RecipeRepository();

export default function RecipesPage() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initFilters = async () => {
      try {
        const options = await recipeRepo.getFilterOptions();
        setCategories(options.categories);
        setTags(options.tags);
        // Initial fetch of all recipes
        await fetchRecipes();
      } catch (err) {
        console.error('Init filters error:', err);
        setError('Failed to load filter options.');
      } finally {
        setIsLoading(false);
      }
    };

    initFilters();
  }, []);

  const fetchRecipes = async (cats = selectedCategories, tgs = selectedTags) => {
    try {
      setIsFiltering(true);
      const result = await recipeRepo.getRecipesByFilters(cats, tgs);
      setRecipes(result);
    } catch (err) {
      console.error('Fetch recipes error:', err);
      setError('Failed to fetch recipes.');
    } finally {
      setIsFiltering(false);
    }
  };

  const handleToggleCategory = (id: number) => {
    const updated = selectedCategories.includes(id)
      ? selectedCategories.filter(cid => cid !== id)
      : [...selectedCategories, id];
    setSelectedCategories(updated);
  };

  const handleToggleTag = (id: number) => {
    const updated = selectedTags.includes(id)
      ? selectedTags.filter(tid => tid !== id)
      : [...selectedTags, id];
    setSelectedTags(updated);
  };

  const handleApplyFilters = () => {
    fetchRecipes();
    setIsDrawerOpen(false);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    fetchRecipes([], []);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-luxury-bg text-luxury-text">
        <Loader2 className="w-10 h-10 animate-spin text-luxury-accent-start mb-4" />
        <p className="text-sm font-serif italic text-luxury-text-muted">Curating your culinary experience...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg px-6 py-12 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-luxury-accent-start font-bold text-[10px] uppercase tracking-widest mb-2">
              <UtensilsCrossed className="w-3 h-3" />
              <span>The Recipe Gallery</span>
            </div>
            <h1 className="text-5xl font-serif font-bold text-luxury-text leading-tight">
              Discover <br />
              <span className="text-luxury-accent-start italic">Culinary Art</span>
            </h1>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-luxury-border rounded-full text-xs font-bold uppercase tracking-widest text-luxury-text hover:border-luxury-accent-start transition-all duration-300 shadow-sm"
          >
            <Filter className="w-3 h-3" />
            Advanced Filter
          </button>
        </div>

        {/* Filter Bar */}
        <RecipeFilterBar
          categories={categories}
          tags={tags}
          selectedCategories={selectedCategories}
          selectedTags={selectedTags}
          onToggleCategory={handleToggleCategory}
          onToggleTag={handleToggleTag}
        />

        {/* Active Filters Summary & Clear All */}
        {(selectedCategories.length > 0 || selectedTags.length > 0) && (
          <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-text-muted">Active Filters:</span>
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
            </div>
            <button 
              onClick={clearAllFilters}
              className="text-[10px] font-bold uppercase tracking-widest text-luxury-text-muted hover:text-luxury-accent-start transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Recipes Grid */}
        {error ? (
          <div className="text-center py-20">
            <p className="text-luxury-text-muted font-serif italic mb-4">{error}</p>
            <button 
              onClick={() => fetchRecipes()}
              className="px-6 py-2 bg-luxury-accent-start text-white rounded-full text-xs font-bold uppercase tracking-widest"
            >
              Try Again
            </button>
          </div>
        ) : isFiltering ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-luxury-surface animate-pulse rounded-xl border border-luxury-border" />
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.recipeId} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-luxury-surface border border-luxury-border mb-6">
              <UtensilsCrossed className="w-8 h-8 text-luxury-text-muted" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-luxury-text mb-2">No Recipes Found</h3>
            <p className="text-luxury-text-muted font-serif italic">Try adjusting your filters to discover more culinary delights.</p>
          </div>
        )}

        {/* Filter Drawer */}
        <FilterDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          categories={categories}
          tags={tags}
          selectedCategories={selectedCategories}
          selectedTags={selectedTags}
          onToggleCategory={handleToggleCategory}
          onToggleTag={handleToggleTag}
          onApply={() => {
            handleApplyFilters();
          }}
        />
      </div>
    </div>
  );
}
