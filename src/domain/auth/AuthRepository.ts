import { AuthResponse, AuthUser } from './Auth';

export interface IAuthRepository {
  login(username: string, password: string): Promise<AuthResponse & { data: AuthUser }>;
  logout(): void;
  checkAuth(): Promise<boolean>;
}
