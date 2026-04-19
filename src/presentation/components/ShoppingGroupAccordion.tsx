"use client";

import React, { useState } from 'react';
import { ChevronDown, Check, Trash2, Plus } from 'lucide-react';
import { ShoppingList, ShoppingItem } from '@/domain/shopping/ShoppingList';

interface ShoppingGroupAccordionProps {
  list: ShoppingList;
  type: 'market' | 'recipe';
  onStatusChange: (itemId: number, isCheck: boolean) => void;
  onDelete: (listId: number) => void;
  onAddItem: (listId: number) => void;
  onDeleteItem: (item: ShoppingItem) => void;
}

const ShoppingGroupAccordion = ({ list, type, onStatusChange, onDelete, onAddItem, onDeleteItem }: ShoppingGroupAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Sort items: Unchecked first, Checked last
  const sortedItems = [...list.items].sort((a, b) => {
    if (a.isCheck === b.isCheck) return 0;
    return a.isCheck ? 1 : -1;
  });

  return (
    <div className="mb-4 overflow-hidden rounded-3xl border border-luxury-border bg-white dark:bg-white/5 transition-all duration-300 hover:shadow-lg hover:shadow-luxury-accent-start/5 group/card">
      {/* Accordion Header */}
      <div className="flex w-full items-center justify-between p-5 transition-colors hover:bg-luxury-surface/50 dark:hover:bg-white/5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-1 items-center gap-4 text-left"
        >
          <h3 className="text-xl font-serif italic text-luxury-text">
            {list.title}
          </h3>
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddItem(list.id)}
            className="p-2 text-luxury-text-muted hover:text-luxury-accent-start hover:bg-luxury-accent-start/10 rounded-full transition-all duration-200"
            title="Add Item"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(list.id)}
            className="p-2 text-luxury-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
            title="Delete List"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <ChevronDown
            className={`w-5 h-5 text-luxury-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

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
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-luxury-text-muted group-hover:text-luxury-accent-start transition-colors">
                      {item.quantity} {item.unit}
                    </span>
                    <button
                      onClick={() => onDeleteItem(item)}
                      className="p-1.5 text-luxury-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
