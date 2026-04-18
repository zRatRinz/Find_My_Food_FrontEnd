import { ShoppingList } from '@/domain/shopping/ShoppingList';
import { IShoppingRepository } from '@/domain/shopping/IShoppingRepository';
import { ShoppingListDTO, ShoppingMapper } from './ShoppingDTO';
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

  async updateItemStatus(itemId: number, isCheck: boolean): Promise<void> {
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
    } catch (error) {
      console.error('ShoppingApiRepository.updateItemStatus error:', error);
      throw error;
    }
  }
}

export const shoppingApi = new ShoppingApiRepository();
