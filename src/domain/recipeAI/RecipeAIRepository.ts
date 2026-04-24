import { RecipeAIResult, IngredientScanResult } from './RecipeAI';

export interface IRecipeAIRepository {
  analyzeFoodImage(file: File, forceSearch: boolean): Promise<RecipeAIResult>;
  analyzeIngredientImage(file: File): Promise<IngredientScanResult>;
}
