import { Recipe } from '../recipe/Recipe';

export interface RecipeAIResult {
  isFood: boolean;
  predictedNames: string[];
  recipes: Recipe[];
}

export interface IngredientScanResult {
  ingredients: string[];
  tags: {
    id: number;
    name: string;
  }[];
  recipes: Recipe[];
}
