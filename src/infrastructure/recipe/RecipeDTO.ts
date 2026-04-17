export interface RecipeDTO {
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

export interface CategoryTagDTO {
  tag_id: number;
  tag_name: string;
}

export interface RecipeDetailInfoDTO extends RecipeDTO {
  category_details: CategoryTagDTO[];
  tag_details: CategoryTagDTO[];
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

export interface RecipeDetailDTO {
  recipe: RecipeDetailInfoDTO;
  ingredients: IngredientDTO[];
  steps: RecipeStepDTO[];
}

export class RecipeMapper {
  static toDomain(dto: RecipeDTO) {
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

  static toRecipeDetail(dto: RecipeDetailDTO) {
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
      categoryDetails: (recipeDto.category_details || []).map((cat) => ({
        tagId: cat.tag_id,
        tagName: cat.tag_name,
      })),
      tagDetails: (recipeDto.tag_details || []).map((tag) => ({
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
