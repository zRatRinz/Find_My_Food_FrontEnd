import { ShoppingList } from './ShoppingList';

export interface IShoppingRepository {
  getShoppingLists(type: string): Promise<ShoppingList[]>;
  updateItemStatus(itemId: number, isCheck: boolean): Promise<void>;
}
