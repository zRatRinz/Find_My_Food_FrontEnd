export interface StandardResponse<T> {
  status: string;
  message: string | null;
  data: T | null;
}
