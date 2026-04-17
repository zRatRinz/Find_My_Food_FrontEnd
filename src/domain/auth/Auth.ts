export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AuthUser {
  username: string;
  email: string;
  image_url: string | null;
}
