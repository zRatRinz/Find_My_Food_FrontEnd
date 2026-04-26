import { ShoppingList } from '@/domain/shopping/ShoppingList';
import { ShoppingIngredientPreview } from '@/domain/shopping/ShoppingIngredientPreview';
import { IShoppingRepository, CreateShoppingListRequest, AddItemToShoppingListRequest } from '@/domain/shopping/ShoppingRepository';
import { ShoppingListDTO, ShoppingMapper, CreateNewShoppingListDTO, AddShoppingItemToShoppingListDTO } from './ShoppingDTO';
import { APP_CONFIG } from '@/infrastructure/common/config';

export class ShoppingApiRepository implements IShoppingRepository {
  private baseUrl = APP_CONFIG.api.baseUrl;

  async getShoppingLists(type: string): Promise<ShoppingList[]> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/shoppingCart/getShoppingList/${type}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.data)) {
        const dtos: ShoppingListDTO[] = result.data;
        return dtos.map((dto) => ShoppingMapper.toDomainList(dto));
      } else {
        throw new Error(result.message || 'Failed to fetch shopping lists');
      }
    } catch (error) {
      console.error('ShoppingApiRepository.getShoppingLists error:', error);
      throw error;
    }
  }

  async updateItemStatus(itemId: number, isCheck: boolean): Promise<ShoppingItem> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/shoppingCart/updateShoppingItemStatus/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_check: isCheck }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'success' && result.data) {
        return ShoppingMapper.toDomainItemFromUpdate(result.data);
      } else {
        throw new Error(result.message || 'Failed to update item status');
      }
    } catch (error) {
      console.error('ShoppingApiRepository.updateItemStatus error:', error);
      throw error;
    }
  }

  async updateItemQuantity(itemId: number, quantity: number): Promise<ShoppingItem> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/shoppingCart/updateShoppingItemQuantity/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'success' && result.data) {
        return ShoppingMapper.toDomainItemFromUpdate(result.data);
      } else {
        throw new Error(result.message || 'Failed to update item quantity');
      }
    } catch (error) {
      console.error('ShoppingApiRepository.updateItemQuantity error:', error);
      throw error;
    }
  }

  async updateItemUnit(itemId: number, unitId: number): Promise<ShoppingItem> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/shoppingCartupdateShoppingItemUnit/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unit_id: unitId }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'success' && result.data) {
        return ShoppingMapper.toDomainItemFromUpdate(result.data);
      } else {
        throw new Error(result.message || 'Failed to update item unit');
      }
    } catch (error) {
      console.error('ShoppingApiRepository.updateItemUnit error:', error);
      throw error;
    }
  }

  async createNewShoppingList(request: CreateShoppingListRequest): Promise<ShoppingList> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const dto: CreateNewShoppingListDTO = {
        shopping_type: request.shoppingType,
        list_name: request.listName,
        items: request.items.map(item => ({
          item_name: item.itemName,
          quantity: item.quantity,
          unit_id: item.unitId,
          note: item.note || '',
        })),
      };

      const response = await fetch(`${this.baseUrl}/shoppingCart/createNewShoppingList`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'success' && result.data) {
        return ShoppingMapper.toDomainList(result.data);
      } else {
        throw new Error(result.message || 'Failed to create shopping list');
      }
    } catch (error) {
      console.error('ShoppingApiRepository.createNewShoppingList error:', error);
      throw error;
    }
  }

  async deleteShoppingList(listId: number): Promise<void> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/shoppingCart/deleteShoppingList/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to delete shopping list');
      }
    } catch (error) {
      console.error('ShoppingApiRepository.deleteShoppingList error:', error);
      throw error;
    }
  }

  async addItemToShoppingList(request: AddItemToShoppingListRequest): Promise<void> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const dto: AddShoppingItemToShoppingListDTO = {
        item_name: request.itemName,
        quantity: request.quantity,
        unit_id: request.unitId,
        shopping_list_id: request.shoppingListId,
        note: request.note || '',
      };

      const response = await fetch(`${this.baseUrl}/shoppingCart/addItemToShoppingList`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to add item to shopping list');
      }
    } catch (error) {
      console.error('ShoppingApiRepository.addItemToShoppingList error:', error);
      throw error;
    }
  }

  async deleteItemFromShoppingList(itemId: number): Promise<void> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/shoppingCart/deleteItemFromShoppingList/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to delete item from shopping list');
      }
    } catch (error) {
      console.error('ShoppingApiRepository.deleteItemFromShoppingList error:', error);
      throw error;
    }
  }

  async getShoppingIngredientPreview(recipeId: number): Promise<ShoppingIngredientPreview[]> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/shoppingCart/getShoppingIngredientPreview/${recipeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.data)) {
        return result.data.map((dto: any) => ShoppingMapper.toPreviewDomain(dto));
      } else {
        throw new Error(result.message || 'Failed to fetch ingredient preview');
      }
    } catch (error) {
      console.error('ShoppingApiRepository.getShoppingIngredientPreview error:', error);
      throw error;
    }
  }

  async addItemToShoppingListByRecipeId(recipeId: number, items: any[]): Promise<void> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/shoppingCart/addItemToShoppingListByRecipeId`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe_id: recipeId,
          items: items,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to add items to shopping list');
      }
    } catch (error) {
      console.error('ShoppingApiRepository.addItemToShoppingListByRecipeId error:', error);
      throw error;
    }
  }
}

export const shoppingApi = new ShoppingApiRepository();
