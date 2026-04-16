export interface AuthDTO {
  access_token: string;
  token_type: string;
  data: {
    username: string;
    email: string;
    image_url: string | null;
    gender: string | null;
  };
}

export class AuthMapper {
  static toDomainUser(dto: AuthDTO) {
    return {
      username: dto.data.username,
      email: dto.data.email,
      image_url: dto.data.image_url,
      gender: dto.data.gender,
    };
  }
}
