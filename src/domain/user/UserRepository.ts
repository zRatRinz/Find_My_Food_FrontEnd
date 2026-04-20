import { User } from './User';
import { LikedRecipe } from '@/domain/recipe/LikedRecipe';

export interface IUserRepository {
  getSimpleUserInfo(): Promise<User>;
  getUserLikedRecipes(): Promise<LikedRecipe[]>;
}
