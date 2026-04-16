import { User } from './User';

export interface IUserRepository {
  getSimpleUserInfo(): Promise<User>;
}
