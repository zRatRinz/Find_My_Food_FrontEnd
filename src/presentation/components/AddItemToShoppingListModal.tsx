"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Unit } from '@/domain/unit/Unit';
import { unitApi } from '@/infrastructure/unit/UnitApiRepository';

interface AddItemToShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: {
    itemName: string;
    quantity: number;
    unitId: number;
    note: string;
  }) => Promise<void>;
  shoppingListId: number;
  isLoading?: boolean;
}

const AddItemToShoppingListModal = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  shoppingListId, 
  isLoading = false 
}: AddItemToShoppingListModalProps) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedUnitId, setSelectedUnitId] = useState<number | ''>('');
  const [note, setNote] = useState('');
  const [units, setUnits] = useState<Unit[]>([]);
  const [fetchingUnits, setFetchingUnits] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUnits();
    }
  }, [isOpen]);

  const fetchUnits = async () => {
    try {
      setFetchingUnits(true);
      const data = await unitApi.getUnits();
      setUnits(data);
      if (data.length > 0) {
        setSelectedUnitId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch units:', err);
    } finally {
      setFetchingUnits(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !selectedUnitId) return;

    await onAdd({
      itemName,
      quantity,
      unitId: Number(selectedUnitId),
      note,
    });
    
    // Reset form
    setItemName('');
    setQuantity(1);
    setNote('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-luxury-surface border border-luxury-border shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-luxury-accent-start/10 rounded-xl text-luxury-accent-start">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-serif italic text-luxury-text">
                Add New Item
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-luxury-text-muted hover:text-luxury-text transition-colors rounded-full hover:bg-luxury-surface/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-luxury-text-muted ml-1">
                Item Name
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Organic Avocado"
                className="w-full px-4 py-3 rounded-2xl bg-luxury-surface border border-luxury-border focus:border-luxury-accent-start outline-none transition-all text-luxury-text placeholder:text-luxury-text-muted/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-luxury-text-muted ml-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-luxury-surface border border-luxury-border focus:border-luxury-accent-start outline-none transition-all text-luxury-text"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-luxury-text-muted ml-1">
                  Unit
                </label>
                <div className="relative">
                  <select
                    value={selectedUnitId}
                    onChange={(e) => setSelectedUnitId(Number(e.target.value))}
                    disabled={fetchingUnits}
                    className="w-full px-4 py-3 rounded-2xl bg-luxury-surface border border-luxury-border focus:border-luxury-accent-start outline-none transition-all text-luxury-text appearance-none cursor-pointer disabled:opacity-50"
                    required
                  >
                    {fetchingUnits ? (
                      <option>Loading units...</option>
                    ) : (
                      units.map(unit => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name} {unit.symbol ? `(${unit.symbol})` : ''}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-luxury-text-muted">
                    <ChevronDownIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-luxury-text-muted ml-1">
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Ripe and ready to eat"
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-luxury-surface border border-luxury-border focus:border-luxury-accent-start outline-none transition-all text-luxury-text placeholder:text-luxury-text-muted/50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !itemName || !selectedUnitId}
              className="w-full py-4 bg-luxury-text text-white rounded-2xl font-medium hover:bg-luxury-text/90 transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add to List
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Simple ChevronDown icon since lucide-react might be imported differently
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default AddItemToShoppingListModal;
