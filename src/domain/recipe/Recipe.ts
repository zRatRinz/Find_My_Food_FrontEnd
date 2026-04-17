export interface Tag {
  tagId: number;
  tagName: string;
}

export interface Recipe {
  recipeId: number;
  recipeName: string;
  description: string | null;
  cookingTimeMin: number | null;
  imageUrl: string | null;
  username: string | null;
  createDate: string | null;
  updateDate: string | null;
  isPublic: boolean;
  isActive: boolean;
  likeCount: number;
  isLiked: boolean;
  tags: string[];
}

export interface Ingredient {
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unitId: number;
  unitName: string;
  isMainIngredient: boolean;
}

export interface RecipeStep {
  stepId: number;
  stepNumber: number;
  description: string;
}

export interface RecipeDetail {
  recipeId: number;
  recipeName: string;
  description: string | null;
  cookingTimeMin: number | null;
  imageUrl: string | null;
  username: string | null;
  createDate: string | null;
  updateDate: string | null;
  isPublic: boolean;
  isActive: boolean;
  likeCount: number;
  isLiked: boolean;
  categoryDetails: Tag[];
  tagDetails: Tag[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
}
