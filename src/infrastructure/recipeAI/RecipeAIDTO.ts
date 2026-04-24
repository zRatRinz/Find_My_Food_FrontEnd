import { RecipeDTO } from '../recipe/RecipeDTO';

export interface AnalyzeFoodResponseDTO {
  is_food: boolean;
  predicted_name: string[] | null;
  recipes: RecipeDTO[];
}

export interface TagDTO {
  tag_id: number;
  tag_name: string;
}

export interface ScanIngredientResponseDTO {
  ingredients: string[];
  tags: TagDTO[];
  recipes: RecipeDTO[];
}

export class RecipeAIMapper {
  static toFoodResult(dto: AnalyzeFoodResponseDTO) {
    return {
      isFood: dto.is_food,
      predictedNames: dto.predicted_name || [],
      recipes: dto.recipes || [], // We can use RecipeMapper.toDomain here if we want to map further, but usually, we map to Domain Model in the Repository
    };
  }

  static toIngredientResult(dto: ScanIngredientResponseDTO) {
    return {
      ingredients: dto.ingredients || [],
      tags: (dto.tags || []).map(tag => ({
        id: tag.tag_id,
        name: tag.tag_name,
      })),
      recipes: dto.recipes || [],
    };
  }
}
