export interface UserDTO {
  user_id: number;
  username: string;
  email: string;
  image_url: string | null;
}

export class UserMapper {
  static toDomain(dto: UserDTO) {
    return {
      user_id: dto.user_id,
      username: dto.username,
      email: dto.email,
      image_url: dto.image_url,
    };
  }
}
