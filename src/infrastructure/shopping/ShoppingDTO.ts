import { ShoppingItem, ShoppingList } from '@/domain/shopping/ShoppingList';

export interface ShoppingItemDTO {
  shopping_item_id: number;
  item_name: string;
  quantity: number;
  unit_name: string;
  is_check: boolean;
  note: string;
}

export interface ShoppingIngredientPreviewDTO {
  ingredient_id: number;
  item_name: string;
  recipe_quantity: number;
  recipe_unit_name: string;
  user_stock: number | null;
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

export interface UpdateShoppingItemQuantityDTO {
  quantity: number;
}

export interface UpdateShoppingItemUnitDTO {
  unit_id: number;
}

export interface UpdateShoppingItemResponseDTO {
  shopping_item_id: number;
  item_name: string;
  quantity: number;
  unit_id: number;
  unit_name: string;
  is_check: boolean;
  note: string | null;
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

  static toPreviewDomain(dto: ShoppingIngredientPreviewDTO): ShoppingIngredientPreview {
    return {
      ingredientId: dto.ingredient_id,
      itemName: dto.item_name,
      recipeQuantity: dto.recipe_quantity,
      recipeUnitName: dto.recipe_unit_name,
      userStock: dto.user_stock,
    };
  }

  static toDomainItemFromUpdate(dto: UpdateShoppingItemResponseDTO): ShoppingItem {
    return {
      id: dto.shopping_item_id,
      name: dto.item_name,
      quantity: dto.quantity,
      unit: dto.unit_name,
      isCheck: dto.is_check,
      note: dto.note || '',
    };
  }
}
