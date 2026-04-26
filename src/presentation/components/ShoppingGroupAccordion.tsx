import React, { useState } from 'react';
import { ChevronDown, Trash2, Plus } from 'lucide-react';
import { ShoppingList, ShoppingItem } from '@/domain/shopping/ShoppingList';
import ShoppingItemRow from './ShoppingItemRow';
import { Unit } from '@/domain/unit/Unit';

interface ShoppingGroupAccordionProps {
  list: ShoppingList;
  type: 'market' | 'recipe';
  onStatusChange: (itemId: number, isCheck: boolean) => Promise<ShoppingItem>;
  onQuantityChange: (itemId: number, quantity: number) => Promise<ShoppingItem>;
  onUnitChange: (itemId: number, unitId: number) => Promise<ShoppingItem>;
  onDelete: (listId: number) => void;
  onAddItem: (listId: number) => void;
  onDeleteItem: (item: ShoppingItem) => void;
  units: Unit[];
}

const ShoppingGroupAccordion = ({ list, type, onStatusChange, onQuantityChange, onUnitChange, onDelete, onAddItem, onDeleteItem, units }: ShoppingGroupAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Sort items: Unchecked first, Checked last
  const sortedItems = [...list.items].sort((a, b) => {
    if (a.isCheck === b.isCheck) return 0;
    return a.isCheck ? 1 : -1;
  });

  return (
    <div className={`mb-4 rounded-3xl border border-luxury-border bg-white dark:bg-white/5 transition-all duration-300 hover:shadow-lg hover:shadow-luxury-accent-start/5 group/card ${isOpen ? 'overflow-visible' : 'overflow-hidden'}`}>
      {/* Accordion Header */}
      <div className="flex w-full items-center justify-between p-5 transition-colors hover:bg-luxury-surface/50 dark:hover:bg-white/5 rounded-t-3xl">
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
        <div className={`${isOpen ? 'overflow-visible' : 'overflow-hidden'}`}>
          <div className="p-5 pt-0 space-y-3">
            {sortedItems.length > 0 ? (
              sortedItems.map((item, idx) => (
                <ShoppingItemRow
                  key={item.id || idx}
                  item={item}
                  onStatusChange={onStatusChange}
                  onQuantityChange={onQuantityChange}
                  onUnitChange={onUnitChange}
                  onDeleteItem={onDeleteItem}
                  units={units}
                />
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
