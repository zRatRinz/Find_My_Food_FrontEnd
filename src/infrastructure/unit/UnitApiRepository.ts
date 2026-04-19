import { Unit } from '@/domain/unit/Unit';
import { IUnitRepository } from '@/domain/unit/UnitRepository';
import { UnitDTO, UnitMapper } from './UnitDTO';
import { APP_CONFIG } from '@/infrastructure/common/config';

export class UnitApiRepository implements IUnitRepository {
  private baseUrl = APP_CONFIG.api.baseUrl;

  async getUnits(): Promise<Unit[]> {
    try {
      const response = await fetch(`${this.baseUrl}/unit/`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.data)) {
        const dtos: UnitDTO[] = result.data;
        return dtos.map((dto) => UnitMapper.toDomain(dto));
      } else {
        throw new Error(result.message || 'Failed to fetch units');
      }
    } catch (error) {
      console.error('UnitApiRepository.getUnits error:', error);
      throw error;
    }
  }
}

export const unitApi = new UnitApiRepository();
