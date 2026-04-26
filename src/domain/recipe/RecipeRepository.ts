import { Recipe, RecipeDetail } from './Recipe';

export interface IRecipeRepository {
  getAllRecipes(): Promise<Recipe[]>;
  getRecipesByName(name: string): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<RecipeDetail>;
  getMyCreatedRecipes(): Promise<Recipe[]>;
  getRecommendedRecipes(): Promise<Recipe[]>;
  getRecipesByIngredientsAndTag(ingredients: string[], tagIds: number[]): Promise<Recipe[]>;
  getFilterOptions(): Promise<{ categories: any[], tags: any[] }>;
  getRecipesByFilters(categories: number[], tags: number[]): Promise<Recipe[]>;
}
