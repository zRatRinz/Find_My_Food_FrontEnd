import { Recipe, RecipeDetail } from '../../domain/recipe/Recipe';
import { IRecipeRepository } from '../../domain/recipe/RecipeRepository';
import { RecipeDTO, RecipeDetailDTO, RecipeMapper } from './RecipeDTO';
import { StandardResponse } from '../common/CommonDTO';
import { APP_CONFIG } from '../common/config';

export class RecipeRepository implements IRecipeRepository {
  private baseUrl = APP_CONFIG.api.baseUrl;

  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const response = await fetch(`${this.baseUrl}/recipe/getAllRecipe`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = (await response.json()) as StandardResponse<RecipeDTO[]>;

      if (result.status !== 'success') {
        throw new Error(result.message || 'An unknown error occurred while fetching recipes');
      }

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid data format received from API');
      }

      return result.data.map((dto) => RecipeMapper.toDomain(dto));
    } catch (error) {
      console.error('RecipeRepository.getAllRecipes error:', error);
      throw error;
    }
  }

  async getRecipesByName(name: string): Promise<Recipe[]> {
    try {
      const response = await fetch(`${this.baseUrl}/recipegetRecipeByName/${encodeURIComponent(name)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = (await response.json()) as StandardResponse<RecipeDTO[]>;

      if (result.status !== 'success') {
        throw new Error(result.message || 'An unknown error occurred while searching recipes');
      }

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid data format received from API');
      }

      return result.data.map((dto) => RecipeMapper.toDomain(dto));
    } catch (error) {
      console.error('RecipeRepository.getRecipesByName error:', error);
      throw error;
    }
  }

  async getRecipeById(id: number): Promise<RecipeDetail> {
    try {
      const response = await fetch(`${this.baseUrl}/recipe/getRecipeDetailById/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = (await response.json()) as StandardResponse<RecipeDetailDTO>;

      if (result.status !== 'success') {
        throw new Error(result.message || 'An unknown error occurred while fetching recipe details');
      }

      if (!result.data) {
        throw new Error('Recipe details not found');
      }

      return RecipeMapper.toRecipeDetail(result.data);
    } catch (error) {
      console.error('RecipeRepository.getRecipeById error:', error);
      throw error;
    }
  }
}
