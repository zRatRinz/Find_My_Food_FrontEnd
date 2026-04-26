import React, { useState, useEffect } from 'react';
import { X, Edit3, ShoppingBag, Check } from 'lucide-react';
import { ShoppingIngredientPreview } from '@/domain/shopping/ShoppingIngredientPreview';
import { shoppingApi } from '@/infrastructure/shopping/ShoppingApiRepository';
import { unitApi } from '@/infrastructure/unit/UnitApiRepository';
import { Unit } from '@/domain/unit/Unit';
import { useToast } from '@/presentation/contexts/ToastContext';

interface LocalIngredient extends ShoppingIngredientPreview {
  isSelected: boolean;
  currentQuantity: number;
  currentUnitName: string;
}

interface IngredientPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: number;
  recipeName: string;
}

const IngredientPreviewModal = ({ isOpen, onClose, recipeId, recipeName }: IngredientPreviewModalProps) => {
  const [ingredients, setIngredients] = useState<LocalIngredient[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen, recipeId]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [previewData, unitData] = await Promise.all([
        shoppingApi.getShoppingIngredientPreview(recipeId),
        unitApi.getUnits()
      ]);

      setIngredients(previewData.map(item => ({
        ...item,
        isSelected: true,
        currentQuantity: item.recipeQuantity,
        currentUnitName: item.recipeUnitName
      })));
      setUnits(unitData);
    } catch (err: any) {
      setError(err.message || 'Failed to load preview data');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (id: number) => {
    setIngredients(prev => prev.map(item =>
      item.ingredientId === id ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  const toggleSelectAll = () => {
    const allSelected = ingredients.every(item => item.isSelected);
    setIngredients(prev => prev.map(item => ({ ...item, isSelected: !allSelected })));
  };

  const updateQuantity = (id: number, value: string) => {
    const numValue = parseFloat(value);
    setIngredients(prev => prev.map(item =>
      item.ingredientId === id ? { ...item, currentQuantity: isNaN(numValue) ? 0 : numValue } : item
    ));
  };

  const updateUnit = (id: number, unitName: string) => {
    setIngredients(prev => prev.map(item =>
      item.ingredientId === id ? { ...item, currentUnitName: unitName } : item
    ));
  };

  const handleConfirmAdd = async () => {
    const selectedItems = ingredients.filter(item => item.isSelected);
    
    if (selectedItems.length === 0) return;

    try {
      const itemsToSubmit = selectedItems.map(item => {
        const unit = units.find(u => u.name === item.currentUnitName);
        return {
          ingredient_id: item.ingredientId,
          item_name: item.itemName,
          quantity: item.currentQuantity,
          unit_id: unit ? unit.id : 0, // Fallback to 0 if unit not found
        };
      });

      await shoppingApi.addItemToShoppingListByRecipeId(recipeId, itemsToSubmit);
      
      showToast(`Successfully added ${selectedItems.length} ingredients to your shopping list!`, 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to add ingredients to cart', 'error');
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <style dangerouslySetInnerHTML={{ __html: `
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}} />
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-luxury-surface rounded-3xl shadow-2xl border border-luxury-border overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="px-8 py-6 border-b border-luxury-border flex justify-between items-center bg-white/50 dark:bg-black/20 backdrop-blur-md">
          <div>
            <h3 className="text-2xl font-serif italic text-luxury-text">Review Ingredients</h3>
            <p className="text-xs font-medium text-luxury-text-muted uppercase tracking-widest">
              For {recipeName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-luxury-text-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-luxury-accent-start border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs uppercase tracking-widest text-luxury-text-muted">Curating your list...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchInitialData}
                className="text-xs font-bold uppercase tracking-widest text-luxury-accent-start hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : ingredients.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-luxury-text-muted italic">No ingredients found for this recipe.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Select All Toggle */}
              <div className="flex justify-end mb-4">
                <button 
                  onClick={toggleSelectAll}
                  className="text-[10px] font-bold uppercase tracking-widest text-luxury-accent-start hover:text-luxury-accent-end transition-colors flex items-center gap-2"
                >
                  {ingredients.every(i => i.isSelected) ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="space-y-4">
                {ingredients.map((item) => (
                  <div
                    key={item.ingredientId}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      item.isSelected
                        ? 'bg-white/60 dark:bg-black/30 border-luxury-accent-start/40'
                        : 'bg-gray-50/50 dark:bg-gray-900/20 border-luxury-border opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => toggleSelection(item.ingredientId)}
                        className="relative w-5 h-5 cursor-pointer transition-all duration-200 group"
                      >
                        <div className={`absolute inset-0 rounded-md border-2 transition-all duration-200 ${
                          item.isSelected
                            ? 'bg-luxury-accent-start border-luxury-accent-start'
                            : 'bg-transparent border-gray-300 dark:border-gray-600 group-hover:border-luxury-accent-start/50'
                        }`} />
                        {item.isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white stroke-[3px]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className={`font-medium transition-colors ${item.isSelected ? 'text-luxury-text' : 'text-luxury-text-muted'}`}>
                          {item.itemName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        step="0.1"
                        value={item.currentQuantity}
                        onChange={(e) => updateQuantity(item.ingredientId, e.target.value)}
                        className={`w-14 text-center py-1 rounded-md border transition-all outline-none text-xs font-medium ${
                          item.isSelected
                            ? 'bg-white/40 dark:bg-black/30 border-luxury-accent-start/30 dark:border-luxury-accent-start/40 focus:border-luxury-accent-start text-luxury-text'
                            : 'bg-transparent border-transparent text-luxury-text-muted'
                        }`}
                      />
                      <select
                        value={item.currentUnitName}
                        onChange={(e) => updateUnit(item.ingredientId, e.target.value)}
                        className={`text-xs bg-transparent outline-none cursor-pointer transition-colors ${
                          item.isSelected
                            ? 'text-luxury-text hover:text-luxury-accent-start'
                            : 'text-luxury-text-muted'
                        }`}
                      >
                        {units.map(u => (
                          <option key={u.id} value={u.name}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-luxury-border bg-white/50 dark:bg-black/20 backdrop-blur-md flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs text-luxury-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmAdd}
            disabled={ingredients.filter(i => i.isSelected).length === 0}
            className="flex-[2] bg-luxury-gradient text-white py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
          >
            <ShoppingBag className="w-4 h-4" />
            Confirm & Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientPreviewModal;
