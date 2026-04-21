import { Recipe, RecipeDetail } from './Recipe';

export interface IRecipeRepository {
  getAllRecipes(): Promise<Recipe[]>;
  getRecipesByName(name: string): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<RecipeDetail>;
  getMyCreatedRecipes(): Promise<Recipe[]>;
  getRecommendedRecipes(): Promise<Recipe[]>;
}
