import { ShoppingList, ShoppingItem } from './ShoppingList';
import { ShoppingIngredientPreview } from './ShoppingIngredientPreview';

export interface CreateShoppingListRequest {
  shoppingType: 'market' | 'recipe';
  listName: string;
  items: {
    itemName: string;
    quantity: number;
    unitId: number;
    note?: string;
  }[];
}

export interface AddItemToShoppingListRequest {
  itemName: string;
  quantity: number;
  unitId: number;
  shoppingListId: number;
  note?: string;
}

export interface IShoppingRepository {
  getShoppingLists(type: string): Promise<ShoppingList[]>;
  updateItemStatus(itemId: number, isCheck: boolean): Promise<ShoppingItem>;
  createNewShoppingList(request: CreateShoppingListRequest): Promise<ShoppingList>;
  deleteShoppingList(listId: number): Promise<void>;
  addItemToShoppingList(request: AddItemToShoppingListRequest): Promise<void>;
  deleteItemFromShoppingList(itemId: number): Promise<void>;
  getShoppingIngredientPreview(recipeId: number): Promise<ShoppingIngredientPreview[]>;
  addItemToShoppingListByRecipeId(recipeId: number, items: any[]): Promise<void>;
  updateItemQuantity(itemId: number, quantity: number): Promise<ShoppingItem>;
  updateItemUnit(itemId: number, unitId: number): Promise<ShoppingItem>;
}
