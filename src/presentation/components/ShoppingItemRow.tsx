"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Check, Trash2, Minus, Plus, ChevronDown } from 'lucide-react';
import { ShoppingItem } from '@/domain/shopping/ShoppingList';
import { useToast } from '@/presentation/contexts/ToastContext';
import { Unit } from '@/domain/unit/Unit';

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onStatusChange: (itemId: number, isCheck: boolean) => Promise<ShoppingItem>;
  onQuantityChange: (itemId: number, quantity: number) => Promise<ShoppingItem>;
  onUnitChange: (itemId: number, unitId: number) => Promise<ShoppingItem>;
  onDeleteItem: (item: ShoppingItem) => void;
  units: Unit[];
}

const ShoppingItemRow = ({ 
  item, 
  onStatusChange, 
  onQuantityChange, 
  onUnitChange, 
  onDeleteItem, 
  units 
}: ShoppingItemRowProps) => {
  const { showToast } = useToast();
  const [localItem, setLocalItem] = useState(item);
  const [isEditing, setIsEditing] = useState(false);
  const [tempQty, setTempQty] = useState(item.quantity.toString());
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);

  // Timers for debouncing API calls to prevent spamming
  const qtyDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const unitDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalItem(item);
    setTempQty(item.quantity.toString());
  }, [item]);

  // Close dropdown when clicking outside and cleanup timers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUnitOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (qtyDebounceTimerRef.current) clearTimeout(qtyDebounceTimerRef.current);
      if (unitDebounceTimerRef.current) clearTimeout(unitDebounceTimerRef.current);
    };
  }, []);

  const toggleUnitDropdown = () => {
    if (!isUnitOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      
      const headerBuffer = 80; // Approx height of sticky header
      const footerBuffer = 120; // Approx height of footer
      const dropdownHeight = 320; // max-h-80 = 320px

      const usableSpaceAbove = rect.top - headerBuffer;
      const usableSpaceBelow = window.innerHeight - rect.bottom - footerBuffer;

      // Decision Logic:
      // 1. If space below is insufficient, try to open upwards
      if (usableSpaceBelow < dropdownHeight && usableSpaceAbove >= dropdownHeight) {
        setDropUp(true);
      } 
      // 2. If space above is insufficient, must open downwards
      else if (usableSpaceAbove < dropdownHeight && usableSpaceBelow >= dropdownHeight) {
        setDropUp(false);
      }
      // 3. If both are sufficient, pick the one with more space
      else if (usableSpaceAbove >= dropdownHeight && usableSpaceBelow >= dropdownHeight) {
        setDropUp(usableSpaceAbove > usableSpaceBelow);
      }
      // 4. If neither is sufficient, pick the larger one to minimize clipping
      else {
        setDropUp(usableSpaceAbove > usableSpaceBelow);
      }
    }
    setIsUnitOpen(!isUnitOpen);
  };
  const handleStatusToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked;
    const prevItem = { ...localItem };
    setLocalItem(prev => prev ? ({ ...prev, isCheck: newStatus }) : prev);

    try {
      const updatedItem = await onStatusChange(item.id, newStatus);
      if (updatedItem) setLocalItem(updatedItem);
    } catch (err) {
      setLocalItem(prevItem);
      showToast('Failed to update status', 'error');
    }
  };

  const triggerDebouncedQuantityUpdate = (quantity: number) => {
    if (qtyDebounceTimerRef.current) clearTimeout(qtyDebounceTimerRef.current);
    qtyDebounceTimerRef.current = setTimeout(async () => {
      try {
        const updatedItem = await onQuantityChange(item.id, quantity);
        if (updatedItem) setLocalItem(updatedItem);
      } catch (err) {
        showToast('Failed to sync quantity with server', 'error');
        setLocalItem(item);
      }
    }, 2000);
  };

  const handleQuantityChange = (delta: number) => {
    setLocalItem(prev => {
      if (!prev) return prev;
      const newQty = Math.max(0.1, prev.quantity + delta);
      triggerDebouncedQuantityUpdate(newQty);
      return { ...prev, quantity: newQty };
    });
  };

  const handleQtySubmit = () => {
    const newQty = parseFloat(tempQty);
    if (isNaN(newQty) || newQty <= 0) {
      setTempQty(localItem.quantity.toString());
      setIsEditing(false);
      return;
    }
    setIsEditing(false);
    setLocalItem(prev => prev ? ({ ...prev, quantity: newQty }) : prev);
    triggerDebouncedQuantityUpdate(newQty);
  };

  const triggerDebouncedUnitUpdate = (unitId: number) => {
    if (unitDebounceTimerRef.current) clearTimeout(unitDebounceTimerRef.current);
    unitDebounceTimerRef.current = setTimeout(async () => {
      try {
        const updatedItem = await onUnitChange(item.id, unitId);
        if (updatedItem) setLocalItem(updatedItem);
      } catch (err) {
        showToast('Failed to sync unit with server', 'error');
        setLocalItem(item);
      }
    }, 2000);
  };

  const handleUnitSelect = (unitId: number) => {
    if (!localItem) return;
    const selectedUnit = units.find(u => u.id === unitId);
    if (!selectedUnit) return;

    setLocalItem(prev => prev ? ({ ...prev, unit: selectedUnit.name }) : prev);
    setIsUnitOpen(false);
    triggerDebouncedUnitUpdate(unitId);
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-2xl bg-luxury-surface/50 border border-transparent hover:border-luxury-accent-start/20 transition-colors duration-200 group relative ${isUnitOpen ? 'z-20 transform-gpu' : 'z-0'}`}>
      <div className="flex items-center gap-3">
        <label className="relative flex items-center cursor-pointer group/checkbox">
          <input
            type="checkbox"
            checked={localItem?.isCheck}
            className="sr-only"
            onChange={handleStatusToggle}
          />
          <div className={`
            w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center
            ${localItem?.isCheck
              ? 'bg-luxury-gradient border-transparent scale-110'
              : 'border-luxury-border bg-transparent group-hover/checkbox:border-luxury-accent-start'}
          `}>
            {localItem?.isCheck && <Check className="w-3 h-3 text-white stroke-[3px]" />}
          </div>
        </label>
        <span className={`text-sm font-medium transition-all duration-300 ${localItem?.isCheck ? 'line-through text-luxury-text-muted opacity-50' : 'text-luxury-text'}`}>
          {localItem?.name}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-luxury-surface/80 dark:bg-white/10 border border-luxury-border rounded-full px-1 py-0.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-luxury-accent-start/50">
          <div className="flex items-center gap-2 px-1.5">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-1 text-luxury-text-muted hover:text-luxury-accent-start hover:bg-luxury-accent-start/10 rounded-full transition-all duration-200"
            >
              <Minus className="w-3 h-3" />
            </button>
            
            {isEditing ? (
              <input
                type="number"
                step="0.1"
                value={tempQty}
                onChange={(e) => setTempQty(e.target.value)}
                onBlur={handleQtySubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleQtySubmit()}
                className="w-12 text-center text-xs font-bold bg-transparent outline-none text-luxury-text"
                autoFocus
              />
            ) : (
              <span 
                onClick={() => {
                  setTempQty(localItem.quantity.toString());
                  setIsEditing(true);
                }}
                className="text-xs font-bold w-8 text-center text-luxury-text tabular-nums cursor-pointer hover:text-luxury-accent-start transition-colors"
              >
                {localItem?.quantity}
              </span>
            )}

            <button
              onClick={() => handleQuantityChange(1)}
              className="p-1 text-luxury-text-muted hover:text-luxury-accent-start hover:bg-luxury-accent-start/10 rounded-full transition-all duration-200"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="relative group/unit w-24 h-6 flex items-center justify-center" ref={dropdownRef}>
            <div className="absolute left-0 h-4 w-[1px] bg-luxury-border"></div>
            
            <button
              onClick={toggleUnitDropdown}
              className="w-full h-full flex items-center justify-center bg-transparent text-xs font-semibold uppercase tracking-wide text-luxury-text cursor-pointer hover:text-luxury-accent-start outline-none transition-colors dark:text-white"
            >
              {units.find(u => u.name === localItem?.unit)?.name || 'Unit'}
            </button>
            
            <ChevronDown className={`absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-luxury-text-muted pointer-events-none transition-all duration-300 ${isUnitOpen ? 'rotate-180' : ''} ${dropUp ? 'rotate-180' : ''}`} />

            {isUnitOpen && (
              <ul className={`absolute w-full bg-luxury-surface dark:bg-luxury-charcoal border border-luxury-border rounded-xl shadow-2xl z-[100] py-1 animate-in fade-in zoom-in-95 duration-200 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-luxury-border dark:scrollbar-thumb-white/20 scrollbar-track-transparent ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                {units.map(unit => (
                  <li 
                    key={unit.id}
                    onClick={() => handleUnitSelect(unit.id)}
                    className={`
                      px-3 py-2 text-xs font-medium cursor-pointer transition-colors
                      ${localItem?.unit === unit.name 
                        ? 'bg-luxury-accent-start/10 text-luxury-accent-start' 
                        : 'text-luxury-text dark:text-white hover:bg-luxury-accent-start/5'}
                    `}
                  >
                    {unit.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={() => onDeleteItem(item)}
          className="p-1.5 text-luxury-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
          title="Delete Item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ShoppingItemRow;
