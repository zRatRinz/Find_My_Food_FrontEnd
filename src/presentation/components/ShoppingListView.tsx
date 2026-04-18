"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Utensils } from 'lucide-react';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { shoppingApi } from '@/infrastructure/shopping/ShoppingApiRepository';
import { ShoppingList } from '@/domain/shopping/ShoppingList';
import ShoppingGroupAccordion from './ShoppingGroupAccordion';

const ShoppingListView = () => {
  const { isLoggedIn } = useAuth();
  const [marketLists, setMarketLists] = useState<ShoppingList[]>([]);
  const [recipeLists, setRecipeLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    const fetchAllShoppingData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [marketData, recipeData] = await Promise.all([
          shoppingApi.getShoppingLists('market'),
          shoppingApi.getShoppingLists('recipe'),
        ]);

        setMarketLists(marketData);
        setRecipeLists(recipeData);
      } catch (err: any) {
        setError(err.message || 'Failed to load shopping lists');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllShoppingData();
  }, [isLoggedIn]);

  const handleStatusChange = async (itemId: number, isCheck: boolean) => {
    const updateLists = (lists: ShoppingList[]) => {
      return lists.map(list => ({
        ...list,
        items: list.items.map(item => 
          item.id === itemId ? { ...item, isCheck } : item
        )
      }));
    };

    const prevMarketLists = [...marketLists];
    const prevRecipeLists = [...recipeLists];

    setMarketLists(updateLists(marketLists));
    setRecipeLists(updateLists(recipeLists));

    try {
      await shoppingApi.updateItemStatus(itemId, isCheck);
    } catch (err) {
      console.error('Failed to update item status:', err);
      setMarketLists(prevMarketLists);
      setRecipeLists(prevRecipeLists);
      setError('Failed to update item status. Please try again.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-32 text-center px-6">
        <h2 className="text-4xl font-serif italic mb-4 text-luxury-text">Members Only</h2>
        <p className="text-luxury-text-muted max-w-md mb-8 font-light">
          Please sign in to access your curated shopping lists and recipe ingredients.
        </p>
        <Link 
          href="/auth/login" 
          className="px-8 py-3 bg-luxury-text text-white rounded-full hover:bg-luxury-text/90 transition-all duration-300"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-luxury-border border-t-luxury-accent-start rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-luxury-cream dark:bg-luxury-charcoal overflow-hidden">
      {/* Atmospheric Blobs - Exact match with HomeView */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Centered Header */}
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-luxury-text mb-4">
            Shopping List
          </h1>
          <div className="h-[1px] w-24 bg-luxury-accent-start mb-4"></div>
          <p className="text-sm font-medium text-luxury-text-muted uppercase tracking-widest">
            {marketLists.length + recipeLists.length} Curated Lists
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Market Lists Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-luxury-accent-start">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-luxury-text">Market Lists</h2>
              <div className="flex-grow h-[1px] bg-luxury-border"></div>
            </div>

            <div className="space-y-4">
              {marketLists.length > 0 ? (
                marketLists.map((list) => (
                  <ShoppingGroupAccordion key={list.id} list={list} type="market" onStatusChange={handleStatusChange} />
                ))
              ) : (
                <div className="text-center py-12 bg-luxury-surface/30 rounded-3xl border border-dashed border-luxury-border">
                  <p className="text-luxury-text-muted italic font-light">No market lists found.</p>
                </div>
              )}
            </div>
          </section>

          {/* Recipe Lists Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-luxury-accent-end">
                <Utensils className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-luxury-text">Recipe Lists</h2>
              <div className="flex-grow h-[1px] bg-luxury-border"></div>
            </div>

            <div className="space-y-4">
              {recipeLists.length > 0 ? (
                recipeLists.map((list) => (
                  <ShoppingGroupAccordion key={list.id} list={list} type="recipe" onStatusChange={handleStatusChange} />
                ))
              ) : (
                <div className="text-center py-12 bg-luxury-surface/30 rounded-3xl border border-dashed border-luxury-border">
                  <p className="text-luxury-text-muted italic font-light">No recipe-based lists found.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListView;
