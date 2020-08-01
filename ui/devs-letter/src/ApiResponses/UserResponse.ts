import { Role } from "../Enums/Role";

export interface UserResponse {
  id: string
  email: string
  createdAt: Date
  type: Role
}