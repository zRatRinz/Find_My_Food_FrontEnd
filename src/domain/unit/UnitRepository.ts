import { Unit } from './Unit';

export interface IUnitRepository {
  getUnits(): Promise<Unit[]>;
}
