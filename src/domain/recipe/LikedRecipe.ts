export interface LikedRecipe {
  id: number;
  name: string;
  description: string;
  cookingTimeMin: number;
  imageUrl: string;
  username: string;
  likeCount: number;
  isLiked: boolean;
}
