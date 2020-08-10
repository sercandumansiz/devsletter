import { LetterStatus } from "../Enums/LetterStatus";

export interface LetterResponse {
  id: string;
  userId: string;
  items: LetterItemResponse[];
  status: LetterStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export interface LetterItemResponse {
  link: string;
}
