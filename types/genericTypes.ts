// Generic API Response Type
export type GenericApiResponse<T> = {
  succeeded?: boolean;
  message?: string;
  data: T | null;
  userId?: number;
  pagination?: any;
  httpStatusCode?: number;
};
