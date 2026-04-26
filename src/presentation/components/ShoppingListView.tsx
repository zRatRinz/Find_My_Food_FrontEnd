"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Utensils, Plus } from 'lucide-react';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { shoppingApi } from '@/infrastructure/shopping/ShoppingApiRepository';
import { ShoppingList } from '@/domain/shopping/ShoppingList';
import { CreateShoppingListRequest } from '@/domain/shopping/ShoppingRepository';
import ShoppingGroupAccordion from './ShoppingGroupAccordion';
import CreateShoppingListModal from './CreateShoppingListModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AddItemToShoppingListModal from './AddItemToShoppingListModal';

const ShoppingListView = () => {
  const { isLoggedIn } = useAuth();
  const [marketLists, setMarketLists] = useState<ShoppingList[]>([]);
  const [recipeLists, setRecipeLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'market' | 'recipe'>('market');
  const [error, setError] = useState<string | null>(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ 
    id: number; 
    title: string; 
    type: 'list' | 'item' 
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Item Modal State
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [listToAddItemTo, setListToAddItemTo] = useState<number | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const fetchAllShoppingData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
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
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

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

  const handleDeleteItemRequest = (item: { id: number; name: string }) => {
    setDeleteTarget({ id: item.id, title: item.name, type: 'item' });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteListRequest = (list: ShoppingList) => {
    setDeleteTarget({ id: list.id, title: list.title, type: 'list' });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const { id, type } = deleteTarget;
    const prevMarketLists = [...marketLists];
    const prevRecipeLists = [...recipeLists];

    try {
      setIsDeleting(true);
      if (type === 'list') {
        // Optimistic Update for List
        setMarketLists(marketLists.filter(list => list.id !== id));
        setRecipeLists(recipeLists.filter(list => list.id !== id));
        await shoppingApi.deleteShoppingList(id);
      } else {
        // Optimistic Update for Item
        const filterItems = (lists: ShoppingList[]) => {
          return lists.map(list => ({
            ...list,
            items: list.items.filter(item => item.id !== id)
          }));
        };
        setMarketLists(filterItems(marketLists));
        setRecipeLists(filterItems(recipeLists));
        await shoppingApi.deleteItemFromShoppingList(id);
      }
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err: any) {
      console.error(`Failed to delete ${type}:`, err);
      setMarketLists(prevMarketLists);
      setRecipeLists(prevRecipeLists);
      setError(err.message || `Failed to delete ${type}. Please try again.`);
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddItemRequest = (listId: number) => {
    setListToAddItemTo(listId);
    setIsAddItemModalOpen(true);
  };

  const handleAddItem = async (itemData: {
    itemName: string;
    quantity: number;
    unitId: number;
    note: string;
  }) => {
    if (!listToAddItemTo) return;

    const prevMarketLists = [...marketLists];
    const prevRecipeLists = [...recipeLists];

    // Optimistic Update: Add a temporary item to the UI
    const newItem = {
      id: Math.random(), // Temporary ID
      name: itemData.itemName,
      quantity: itemData.quantity,
      unit: '...', // Will be updated after fetch
      isCheck: false,
      note: itemData.note,
    };

    const updateLists = (lists: ShoppingList[]) => {
      return lists.map(list => {
        if (list.id === listToAddItemTo) {
          return { ...list, items: [...list.items, newItem] };
        }
        return list;
      });
    };

    setMarketLists(updateLists(marketLists));
    setRecipeLists(updateLists(recipeLists));

    try {
      setIsAddingItem(true);
      await shoppingApi.addItemToShoppingList({
        itemName: itemData.itemName,
        quantity: itemData.quantity,
        unitId: itemData.unitId,
        shoppingListId: listToAddItemTo,
        note: itemData.note,
      });
      setIsAddItemModalOpen(false);
      // Refresh data silently to get the real item ID and unit name from server
      await fetchAllShoppingData(true);
    } catch (err: any) {
      console.error('Failed to add item:', err);
      setMarketLists(prevMarketLists);
      setRecipeLists(prevRecipeLists);
      setError(err.message || 'Failed to add item. Please try again.');
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleCreateList = async (request: CreateShoppingListRequest) => {
    try {
      setIsCreating(true);
      await shoppingApi.createNewShoppingList(request);
      setIsModalOpen(false);
      await fetchAllShoppingData();
    } catch (err: any) {
      setError(err.message || 'Failed to create shopping list');
    } finally {
      setIsCreating(false);
    }
  };

  const openCreateModal = (type: 'market' | 'recipe') => {
    setSelectedType(type);
    setIsModalOpen(true);
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
          className="px-8 py-3 bg-luxury-gradient text-white rounded-full hover:opacity-90 transition-all duration-300 shadow-lg"
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-luxury-accent-start">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-luxury-text">Market Lists</h2>
              </div>
              <button 
                onClick={() => openCreateModal('market')}
                className="flex items-center gap-2 px-4 py-2 bg-luxury-surface border border-luxury-border rounded-full text-xs font-bold uppercase tracking-widest hover:bg-luxury-border transition-all shadow-sm group"
              >
                <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                New List
              </button>
            </div>

            <div className="space-y-4">
              {marketLists.length > 0 ? (
                marketLists.map((list) => (
                  <ShoppingGroupAccordion
                    key={list.id}
                    list={list}
                    type="market"
                    onStatusChange={handleStatusChange}
                    onDelete={() => handleDeleteListRequest(list)}
                    onAddItem={handleAddItemRequest}
                    onDeleteItem={handleDeleteItemRequest}
                  />
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-luxury-accent-end">
                  <Utensils className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-luxury-text">Recipe Lists</h2>
              </div>
              <button 
                onClick={() => openCreateModal('recipe')}
                className="flex items-center gap-2 px-4 py-2 bg-luxury-surface border border-luxury-border rounded-full text-xs font-bold uppercase tracking-widest hover:bg-luxury-border transition-all shadow-sm group"
              >
                <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                New List
              </button>
            </div>

            <div className="space-y-4">
              {recipeLists.length > 0 ? (
                recipeLists.map((list) => (
                  <ShoppingGroupAccordion
                    key={list.id}
                    list={list}
                    type="recipe"
                    onStatusChange={handleStatusChange}
                    onDelete={() => handleDeleteListRequest(list)}
                    onAddItem={handleAddItemRequest}
                    onDeleteItem={handleDeleteItemRequest}
                  />
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

      <CreateShoppingListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateList}
        isLoading={isCreating}
        initialType={selectedType}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={deleteTarget?.type === 'list' ? 'Delete Shopping List' : 'Remove Item'}
        message={
          deleteTarget?.type === 'list'
            ? `Are you sure you want to delete "${deleteTarget?.title}"? This action is permanent.`
            : `Are you sure you want to remove "${deleteTarget?.title}" from your list?`
        }
        confirmText={deleteTarget?.type === 'list' ? 'Delete List' : 'Remove Item'}
        isLoading={isDeleting}
      />

      <AddItemToShoppingListModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onAdd={handleAddItem}
        shoppingListId={listToAddItemTo || 0}
        isLoading={isAddingItem}
      />
    </div>
  );
};

export default ShoppingListView;
