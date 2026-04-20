export interface UserDTO {
  user_id: number;
  username: string;
  email: string;
  gender: string | null;
  birth_date: string | null;
  image_url: string | null;
}

export interface LikedRecipeDTO {
  recipe_id: number;
  recipe_name: string;
  description: string;
  cooking_time_min: number;
  image_url: string;
  username: string;
  like_count: number;
  is_liked: boolean;
}

export interface LikedRecipeListDTO {
  status: string;
  message: string | null;
  data: LikedRecipeDTO[];
}

export class UserMapper {
  static toDomain(dto: UserDTO) {
    return {
      user_id: dto.user_id,
      username: dto.username,
      email: dto.email,
      gender: dto.gender,
      birth_date: dto.birth_date,
      image_url: dto.image_url,
    };
  }

  static toLikedRecipeDomain(dto: LikedRecipeDTO) {
    return {
      id: dto.recipe_id,
      name: dto.recipe_name,
      description: dto.description,
      cookingTimeMin: dto.cooking_time_min,
      imageUrl: dto.image_url,
      username: dto.username,
      likeCount: dto.like_count,
      isLiked: dto.is_liked,
    };
  }

  static toLikedRecipeListDomain(dto: LikedRecipeListDTO) {
    return dto.data.map(item => this.toLikedRecipeDomain(item));
  }
}
