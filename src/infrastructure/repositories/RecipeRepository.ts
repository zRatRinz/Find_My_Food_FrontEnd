import { Recipe, RecipeDetail } from '../../domain/Recipe';
import { IRecipeRepository } from '../../domain/RecipeRepository';
import { RecipeDTO, RecipeDetailDTO, RecipeMapper } from '../dtos/RecipeDTO';
import { StandardResponse } from '../dtos/CommonDTO';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class RecipeRepository implements IRecipeRepository {
  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/recipe/getAllRecipe`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`${API_BASE_URL}/recipegetRecipeByName/${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`${API_BASE_URL}/recipe/getRecipeDetailById/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
