import { IRecipeAIRepository } from '../../domain/recipeAI/RecipeAIRepository';
import { AnalyzeFoodResponseDTO } from '../../domain/recipeAI/AnalyzeFoodDTO';
import { RecipeDTO, RecipeMapper } from '../recipe/RecipeDTO';
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

  async analyzeFoodImage(file: File, forceSearch: boolean): Promise<AnalyzeFoodResponseDTO> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('force_search', String(forceSearch));

      const headers = await this.getAuthHeaders();

      const response = await fetch(`${this.baseUrl}/recipeAI/analyzeFoodImage`, {
        method: 'POST',
        headers: headers, // Note: Content-Type is automatically set to multipart/form-data by fetch when using FormData
        body: formData,
      });

      // Safely parse JSON only if the response is actually JSON
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

      if (result.status !== 'success') {
        throw new Error(result.message || 'An unknown error occurred while analyzing the image');
      }

      if (!result.data) {
        throw new Error('Invalid data format received from AI API');
      }

      return {
        is_food: result.data.is_food,
        predicted_name: result.data.predicted_name,
        recipes: result.data.recipes.map((dto) => RecipeMapper.toDomain(dto)),
      };
    } catch (error) {
      console.error('RecipeAIRepository.analyzeFoodImage error:', error);
      throw error;
    }
  }
}
