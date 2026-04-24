import { Recipe } from '../recipe/Recipe';

export interface AnalyzeFoodResponseDTO {
  is_food: boolean;
  predicted_name: string[] | null;
  recipes: Recipe[];
}
