import { IsNumber, IsOptional, Min } from "class-validator";
import { FriendshipStatus } from "../models/friendship-status.enum";

export class FriendshipInput {
  @Min(1)
  @IsNumber()
  @IsOptional()
  requesteeId: number;

  @IsOptional()
  status: FriendshipStatus;
}
