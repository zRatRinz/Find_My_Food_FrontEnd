import { ShoppingItem, ShoppingList } from '@/domain/shopping/ShoppingList';

export interface ShoppingItemDTO {
  shopping_item_id: number;
  item_name: string;
  quantity: number;
  unit_name: string;
  is_check: boolean;
  note: string;
}

export interface AddShoppingItemInNewShoppingListDTO {
  item_name: string;
  quantity: number;
  unit_id: number;
  note: string;
}

export interface CreateNewShoppingListDTO {
  shopping_type: 'market' | 'recipe';
  list_name: string;
  items: AddShoppingItemInNewShoppingListDTO[];
}

export interface ShoppingListDTO {
  shopping_list_id: number;
  list_name: string;
  status: string;
  create_date: string;
  items: ShoppingItemDTO[];
}

export interface UpdateShoppingItemStatusDTO {
  is_check: boolean;
}

export interface AddShoppingItemToShoppingListDTO {
  item_name: string;
  quantity: number;
  unit_id: number;
  shopping_list_id: number;
  note: string;
}

export class ShoppingMapper {
  static toDomainItem(dto: ShoppingItemDTO): ShoppingItem {
    return {
      id: dto.shopping_item_id,
      name: dto.item_name,
      quantity: dto.quantity,
      unit: dto.unit_name,
      isCheck: dto.is_check,
      note: dto.note,
    };
  }

  static toDomainList(dto: ShoppingListDTO): ShoppingList {
    return {
      id: dto.shopping_list_id,
      title: dto.list_name,
      status: dto.status,
      createDate: dto.create_date,
      items: dto.items.map((item) => this.toDomainItem(item)),
    };
  }
}
