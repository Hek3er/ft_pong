export type JSendResponse<T = unknown> = {
  status: string;
  data: T;
  message?: string;
  code?: string;
};

export type LoginData = {
  token: string
}