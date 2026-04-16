export interface TagDTO {
  tag_id: number;
  tag_name: string;
}

export interface RecipeSummaryDTO {
  recipe_id: number;
  recipe_name: string;
  description: string | null;
  cooking_time_min: number | null;
  image_url: string | null;
  username: string | null;
  create_date: string | null;
  update_date: string | null;
  is_public: boolean;
  is_active: boolean;
  like_count: number;
  is_liked: boolean;
  tags: string[];
}

export interface RecipeDetailDTO {
  recipe_id: number;
  recipe_name: string;
  description: string | null;
  cooking_time_min: number | null;
  image_url: string | null;
  username: string | null;
  create_date: string | null;
  update_date: string | null;
  is_public: boolean;
  is_active: boolean;
  like_count: number;
  is_liked: boolean;
  category_details: TagDTO[];
  tag_details: TagDTO[];
}

export interface IngredientDTO {
  ingredient_id: number;
  ingredient_name: string;
  quantity: number;
  unit_id: number;
  unit_name: string;
  is_main_ingredient: boolean;
}

export interface RecipeStepDTO {
  step_no: number;
  instruction: string;
}

export interface RecipeDetailResponseDTO {
  recipe: RecipeDetailDTO;
  ingredients: IngredientDTO[];
  steps: RecipeStepDTO[];
  is_liked: boolean;
}
