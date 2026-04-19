"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ShoppingCart, Utensils } from 'lucide-react';
import { CreateShoppingListRequest } from '@/domain/shopping/ShoppingRepository';

interface CreateShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (request: CreateShoppingListRequest) => Promise<void>;
  isLoading: boolean;
  initialType?: 'market' | 'recipe';
}

const CreateShoppingListModal: React.FC<CreateShoppingListModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate, 
  isLoading,
  initialType = 'market'
}) => {
  const [listName, setListName] = useState('');
  const [shoppingType, setShoppingType] = useState<'market' | 'recipe'>(initialType);
  const [items, setItems] = useState<{ itemName: string; quantity: number; unitId: number; note: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      setShoppingType(initialType);
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const addItem = () => {
    setItems([...items, { itemName: '', quantity: 1, unitId: 1, note: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) return;

    await onCreate({
      shoppingType,
      listName,
      items,
    });
  };

  const handleReset = () => {
    setListName('');
    setShoppingType('market');
    setItems([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-luxury-surface dark:bg-luxury-charcoal w-full max-w-2xl rounded-3xl border border-luxury-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-luxury-border flex items-center justify-between bg-luxury-surface/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-luxury-accent-start/10 rounded-lg text-luxury-accent-start">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-luxury-text">Create New List</h2>
          </div>
          <button 
            onClick={() => { handleReset(); onClose(); }} 
            className="p-2 hover:bg-luxury-border rounded-full transition-colors text-luxury-text-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-luxury-text-muted ml-1">
                List Title
              </label>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="e.g. Weekly Groceries"
                className="w-full px-4 py-3 rounded-xl border border-luxury-border bg-transparent text-luxury-text focus:ring-2 focus:ring-luxury-accent-start outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-luxury-text-muted ml-1">
                List Type
              </label>
              <div className="flex p-1 bg-luxury-border/30 rounded-xl">
                <button
                  type="button"
                  onClick={() => setShoppingType('market')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    shoppingType === 'market' 
                    ? 'bg-white dark:bg-luxury-surface text-luxury-text shadow-sm' 
                    : 'text-luxury-text-muted hover:text-luxury-text'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Market
                </button>
                <button
                  type="button"
                  onClick={() => setShoppingType('recipe')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    shoppingType === 'recipe' 
                    ? 'bg-white dark:bg-luxury-surface text-luxury-text shadow-sm' 
                    : 'text-luxury-text-muted hover:text-luxury-text'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  Recipe
                </button>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-luxury-text-muted ml-1">
                Initial Items (Optional)
              </label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-xs font-bold text-luxury-accent-start hover:text-luxury-accent-end transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-luxury-border rounded-2xl text-luxury-text-muted italic text-sm font-light">
                  No items added yet. You can add them later.
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-luxury-border/10 rounded-2xl border border-luxury-border/50 group">
                    <div className="md:col-span-5 space-y-1">
                      <input
                        type="text"
                        placeholder="Item name"
                        value={item.itemName}
                        onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-luxury-border bg-transparent outline-none focus:ring-1 focus:ring-luxury-accent-start"
                        required
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-luxury-border bg-transparent outline-none focus:ring-1 focus:ring-luxury-accent-start"
                        required
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <input
                        type="text"
                        placeholder="Unit (e.g. kg, pcs)"
                        value={item.note}
                        onChange={(e) => updateItem(index, 'note', e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-luxury-border bg-transparent outline-none focus:ring-1 focus:ring-luxury-accent-start"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-luxury-border">
            <button
              type="button"
              onClick={() => { handleReset(); onClose(); }}
              className="px-6 py-3 text-sm font-medium text-luxury-text-muted hover:text-luxury-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !listName.trim()}
              className="px-8 py-3 bg-luxury-text dark:bg-luxury-accent-start text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-luxury-text/90 dark:hover:bg-luxury-accent-start/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-luxury-text/20 dark:shadow-luxury-accent-start/20"
            >
              {isLoading ? 'Creating...' : 'Create List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShoppingListModal;
