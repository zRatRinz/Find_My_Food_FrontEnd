import { Unit } from '@/domain/unit/Unit';

export interface UnitDTO {
  unit_id: number;
  unit_name: string;
  unit_symbol: string | null;
}

export class UnitMapper {
  static toDomain(dto: UnitDTO): Unit {
    return {
      id: dto.unit_id,
      name: dto.unit_name,
      symbol: dto.unit_symbol,
    };
  }
}
