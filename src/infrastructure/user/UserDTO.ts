export interface UserDTO {
  user_id: number;
  username: string;
  email: string;
  gender: string | null;
  birth_date: string | null;
  image_url: string | null;
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
}
