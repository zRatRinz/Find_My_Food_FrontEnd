export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  isCheck: boolean;
  note: string;
}

export interface ShoppingList {
  id: number;
  title: string;
  status: string;
  createDate: string;
  items: ShoppingItem[];
}
