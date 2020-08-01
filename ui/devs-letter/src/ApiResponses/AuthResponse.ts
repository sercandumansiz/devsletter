import { UserResponse } from "./UserResponse";

export interface AuthResponse {
  token: string
  refreshToken: string
  user: UserResponse
}