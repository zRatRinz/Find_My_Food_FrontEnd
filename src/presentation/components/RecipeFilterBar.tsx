"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';

interface FilterOption {
  id: number;
  name: string;
}

interface RecipeFilterBarProps {
  categories: FilterOption[];
  tags: FilterOption[];
  selectedCategories: number[];
  selectedTags: number[];
  onToggleCategory: (id: number) => void;
  onToggleTag: (id: number) => void;
}

export const RecipeFilterBar: React.FC<RecipeFilterBarProps> = ({
  categories,
  tags,
  selectedCategories,
  selectedTags,
  onToggleCategory,
  onToggleTag,
}) => {
  return (
    <div className="relative w-full mb-12">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-luxury-accent-start font-bold text-[10px] uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          <span>Curated Filters</span>
        </div>
        <div className="h-px flex-1 bg-luxury-border/50" />
      </div>

      <div className="flex flex-col gap-6">
        {/* Categories Scroll */}
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onToggleCategory(cat.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                selectedCategories.includes(cat.id)
                  ? 'bg-luxury-accent-start text-white border-luxury-accent-start shadow-lg scale-105'
                  : 'bg-white/50 dark:bg-white/5 text-luxury-text dark:text-white border-luxury-border hover:border-luxury-accent-start'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tags Scroll */}
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onToggleTag(tag.id)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-serif italic transition-all duration-300 border ${
                selectedTags.includes(tag.id)
                  ? 'bg-luxury-accent-start text-white border-luxury-accent-start shadow-md scale-105'
                  : 'bg-luxury-accent-start/10 text-luxury-accent-start border-luxury-accent-start/20 hover:bg-luxury-accent-start/20'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
