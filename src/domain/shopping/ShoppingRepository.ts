import { ShoppingList } from './ShoppingList';

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
  updateItemStatus(itemId: number, isCheck: boolean): Promise<void>;
  createNewShoppingList(request: CreateShoppingListRequest): Promise<ShoppingList>;
  deleteShoppingList(listId: number): Promise<void>;
  addItemToShoppingList(request: AddItemToShoppingListRequest): Promise<void>;
  deleteItemFromShoppingList(itemId: number): Promise<void>;
}
