import { IRecipeAIRepository } from '../../domain/recipeAI/RecipeAIRepository';
import { RecipeAIResult, IngredientScanResult } from '../../domain/recipeAI/RecipeAI';
import { RecipeDTO, RecipeMapper } from '../recipe/RecipeDTO';
import { AnalyzeFoodResponseDTO, ScanIngredientResponseDTO, RecipeAIMapper } from './RecipeAIDTO';
import { StandardResponse } from '../common/CommonDTO';
import { APP_CONFIG } from '../common/config';

export class RecipeAIRepository implements IRecipeAIRepository {
  private baseUrl = APP_CONFIG.api.baseUrl;

  private async getAuthHeaders() {
    const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  async analyzeFoodImage(file: File, forceSearch: boolean): Promise<RecipeAIResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('force_search', String(forceSearch));

      const headers = await this.getAuthHeaders();

      const response = await fetch(`${this.baseUrl}/recipeAI/analyzeFoodImage`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = { status: 'fail', message: `Server returned non-JSON response (Status: ${response.status})` };
      }

      if (!response.ok) {
        if (response.status === 404 && result.status === 'fail') {
          const error = new Error(result.message || 'This image does not appear to be food');
          (error as any).isNoFood = true;
          throw error;
        }
        throw new Error(result.message || `Server Error: ${response.status} ${response.statusText}`);
      }

      if (result.status !== 'success' || !result.data) {
        throw new Error(result.message || 'An unknown error occurred while analyzing the image');
      }

      const dto = result.data as AnalyzeFoodResponseDTO;
      const domainResult = RecipeAIMapper.toFoodResult(dto);
      
      return {
        ...domainResult,
        recipes: dto.recipes.map(r => RecipeMapper.toDomain(r))
      };
    } catch (error) {
      console.error('RecipeAIRepository.analyzeFoodImage error:', error);
      throw error;
    }
  }

  async analyzeIngredientImage(file: File): Promise<IngredientScanResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const headers = await this.getAuthHeaders();

      const response = await fetch(`${this.baseUrl}/recipeAI/analyzeIngredientImage`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = { status: 'fail', message: `Server returned non-JSON response (Status: ${response.status})` };
      }

      if (!response.ok) {
        throw new Error(result.message || `Server Error: ${response.status} ${response.statusText}`);
      }

      if (result.status !== 'success' || !result.data) {
        throw new Error(result.message || 'An unknown error occurred while analyzing ingredients');
      }

      const dto = result.data as ScanIngredientResponseDTO;
      const domainResult = RecipeAIMapper.toIngredientResult(dto);

      return {
        ...domainResult,
        recipes: dto.recipes.map(r => RecipeMapper.toDomain(r))
      };
    } catch (error) {
      console.error('RecipeAIRepository.analyzeIngredientImage error:', error);
      throw error;
    }
  }
}
