import { AnalyzeFoodResponseDTO } from './AnalyzeFoodDTO';

export interface IRecipeAIRepository {
  analyzeFoodImage(file: File, forceSearch: boolean): Promise<AnalyzeFoodResponseDTO>;
}
