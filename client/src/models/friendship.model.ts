import { BaseModel } from "./base.model";

export interface Friendship extends BaseModel {
  requestorId: number;
  requesteeId: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}
