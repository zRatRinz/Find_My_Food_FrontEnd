import { Recipe, RecipeDetail } from '../../domain/Recipe';
import { IRecipeRepository } from '../../domain/RecipeRepository';
import { RecipeSummaryDTO, RecipeDetailDTO, RecipeDetailResponseDTO } from '../dtos/RecipeDTO';
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

      const result = (await response.json()) as StandardResponse<RecipeSummaryDTO[]>;

      if (result.status === 'fail' || result.status !== 'success') {
        throw new Error(result.message || 'An unknown error occurred while fetching recipes');
      }

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid data format received from API');
      }

      return result.data.map((dto) => this.mapToRecipe(dto));
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

      const result = (await response.json()) as StandardResponse<RecipeSummaryDTO[]>;

      if (result.status === 'fail' || result.status !== 'success') {
        throw new Error(result.message || 'An unknown error occurred while searching recipes');
      }

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid data format received from API');
      }

      return result.data.map((dto) => this.mapToRecipe(dto));
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

      const result = (await response.json()) as StandardResponse<RecipeDetailResponseDTO>;

      if (result.status === 'fail' || result.status !== 'success') {
        throw new Error(result.message || 'An unknown error occurred while fetching recipe details');
      }

      if (!result.data) {
        throw new Error('Invalid data format received from API');
      }

      return this.mapToRecipeDetail(result.data);
    } catch (error) {
      console.error('RecipeRepository.getRecipeById error:', error);
      throw error;
    }
  }

  private mapToRecipe(dto: RecipeSummaryDTO): Recipe {
    return {
      recipeId: dto.recipe_id,
      recipeName: dto.recipe_name,
      description: dto.description,
      cookingTimeMin: dto.cooking_time_min,
      imageUrl: dto.image_url,
      username: dto.username,
      createDate: dto.create_date,
      updateDate: dto.update_date,
      isPublic: dto.is_public,
      isActive: dto.is_active,
      likeCount: dto.like_count,
      isLiked: dto.is_liked,
      tags: dto.tags || [],
    };
  }

  private mapToRecipeDetail(dto: RecipeDetailResponseDTO): RecipeDetail {
    const recipeDto = dto.recipe;
    return {
      recipeId: recipeDto.recipe_id,
      recipeName: recipeDto.recipe_name,
      description: recipeDto.description,
      cookingTimeMin: recipeDto.cooking_time_min,
      imageUrl: recipeDto.image_url,
      username: recipeDto.username,
      createDate: recipeDto.create_date,
      updateDate: recipeDto.update_date,
      isPublic: recipeDto.is_public,
      isActive: recipeDto.is_active,
      likeCount: recipeDto.like_count,
      isLiked: recipeDto.is_liked,
      categoryDetails: (recipeDto.category_details || []).map(cat => ({
        tagId: cat.tag_id,
        tagName: cat.tag_name,
      })),
      tagDetails: (recipeDto.tag_details || []).map(tag => ({
        tagId: tag.tag_id,
        tagName: tag.tag_name,
      })),
      ingredients: (dto.ingredients || []).map((ing) => ({
        ingredientId: ing.ingredient_id,
        ingredientName: ing.ingredient_name,
        quantity: ing.quantity,
        unitId: ing.unit_id,
        unitName: ing.unit_name,
        isMainIngredient: ing.is_main_ingredient,
      })),
      steps: (dto.steps || []).map((step, idx) => ({
        stepId: idx + 1,
        stepNumber: step.step_no,
        description: step.instruction,
      })),
    };
  }
}
