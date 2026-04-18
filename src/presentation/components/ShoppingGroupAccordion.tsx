"use client";

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { ShoppingList } from '@/domain/shopping/ShoppingList';

interface ShoppingGroupAccordionProps {
  list: ShoppingList;
  type: 'market' | 'recipe';
  onStatusChange: (itemId: number, isCheck: boolean) => void;
}

const ShoppingGroupAccordion = ({ list, type, onStatusChange }: ShoppingGroupAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Sort items: Unchecked first, Checked last
  const sortedItems = [...list.items].sort((a, b) => {
    if (a.isCheck === b.isCheck) return 0;
    return a.isCheck ? 1 : -1;
  });

  return (
    <div className="mb-4 overflow-hidden rounded-3xl border border-luxury-border bg-white dark:bg-white/5 transition-all duration-300 hover:shadow-lg hover:shadow-luxury-accent-start/5">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-luxury-surface/50 dark:hover:bg-white/5"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-serif italic text-luxury-text">
            {list.title}
          </h3>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-luxury-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Accordion Content */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-5 pt-0 space-y-3">
            {sortedItems.length > 0 ? (
              sortedItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-2xl bg-luxury-surface/50 border border-transparent hover:border-luxury-accent-start/20 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    {/* Custom Luxury Checkbox */}
                    <label className="relative flex items-center cursor-pointer group/checkbox">
                      <input 
                        type="checkbox" 
                        checked={item.isCheck}
                        className="sr-only"
                        onChange={(e) => onStatusChange(item.id, e.target.checked)}
                      />
                      <div className={`
                        w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center
                        ${item.isCheck 
                          ? 'bg-luxury-gradient border-transparent scale-110' 
                          : 'border-luxury-border bg-transparent group-hover/checkbox:border-luxury-accent-start'}
                      `}>
                        {item.isCheck && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                      </div>
                    </label>
                    <span className={`text-sm font-medium transition-all duration-300 ${item.isCheck ? 'line-through text-luxury-text-muted opacity-50' : 'text-luxury-text'}`}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-luxury-text-muted group-hover:text-luxury-accent-start transition-colors">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-sm italic text-luxury-text-muted font-light">
                No items in this list.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingGroupAccordion;
