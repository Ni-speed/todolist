import { instance } from "common/api/common-api";
import { ResponseType } from "common/types";
export const authApi = {
  login(data: LoginType) {
    return instance.post<ResponseType<{ userId: number }>>(`/auth/login`, data);
  },
  me() {
    return instance.get<ResponseType<{ id: number; email: string; login: string }>>(`/auth/me`);
  },

  logout() {
    return instance.delete<ResponseType<{ userId: number }>>(`/auth/login`);
  },
};
export type LoginType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};
