"use client";

import React from 'react';
import { X, Filter } from 'lucide-react';

interface FilterOption {
  id: number;
  name: string;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FilterOption[];
  tags: FilterOption[];
  selectedCategories: number[];
  selectedTags: number[];
  onToggleCategory: (id: number) => void;
  onToggleTag: (id: number) => void;
  onApply: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  tags,
  selectedCategories,
  selectedTags,
  onToggleCategory,
  onToggleTag,
  onApply,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-md h-full bg-[#FDFBF7] dark:bg-[#0F0F0F] shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        <div className="p-8 border-b border-luxury-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-luxury-accent-start" />
            <h2 className="text-2xl font-serif font-bold text-luxury-text">Refine Search</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-luxury-surface dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-luxury-text" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Categories Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-text-muted mb-4">Categories</h3>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onToggleCategory(cat.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-luxury-accent-start/10 border-luxury-accent-start text-luxury-accent-start'
                      : 'bg-white dark:bg-white/5 border-luxury-border text-luxury-text dark:text-white hover:border-luxury-accent-start/50'
                  }`}
                >
                  <span className="text-sm font-medium">{cat.name}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    selectedCategories.includes(cat.id) 
                      ? 'bg-luxury-accent-start border-luxury-accent-start text-white' 
                      : 'border-luxury-border'
                  }`}>
                    {selectedCategories.includes(cat.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-text-muted mb-4">Culinary Profiles</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onToggleTag(tag.id)}
                  className={`px-4 py-2 rounded-full text-xs font-serif italic transition-all duration-300 border ${
                    selectedTags.includes(tag.id)
                      ? 'bg-luxury-accent-start text-white border-luxury-accent-start shadow-md'
                      : 'bg-white dark:bg-white/5 text-luxury-text dark:text-white border-luxury-border hover:border-luxury-accent-start/50'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-luxury-border bg-white/50 dark:bg-white/5 backdrop-blur-md">
          <button
            onClick={onApply}
            className="w-full py-4 bg-luxury-gradient text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-transform"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
