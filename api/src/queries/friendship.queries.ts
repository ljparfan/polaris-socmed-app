import { getRepository } from "typeorm";
import { Friendship } from "../entities/friendship.entity";
import { FriendshipStatus } from "../models/friendship-status.enum";

export const fetchFriendshipsByUserIdAndStatusQuery = (
  userId: number,
  status: FriendshipStatus
) =>
  getRepository(Friendship)
    .createQueryBuilder("f")
    .leftJoinAndSelect("f.requestee", "requestee")
    .leftJoinAndSelect("f.requestor", "requestor")
    .leftJoinAndSelect("requestor.profilePhoto", "requestorProfilePhoto")
    .where("f.requesteeId = :userId", { userId: userId })
    .andWhere("f.status = :status", { status })
    .andWhere("f.deletedAt IS NULL");
