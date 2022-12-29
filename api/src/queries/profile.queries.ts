import { Brackets, getRepository } from "typeorm";
import { Friendship } from "../entities/friendship.entity";
import { User } from "../entities/user.entity";
import { FriendshipStatus } from "../models/friendship-status.enum";

export const fetchFriendsQuery = (userId: number) =>
  getRepository(Friendship)
    .createQueryBuilder("f")
    .leftJoinAndSelect("f.requestee", "requestee")
    .leftJoinAndSelect("f.requestor", "requestor")
    .leftJoinAndSelect("requestor.profilePhoto", "requestorProfilePhoto")
    .leftJoinAndSelect("requestee.profilePhoto", "requesteeProfilePhoto")
    .where("f.status = :status", { status: FriendshipStatus.ACCEPTED })
    .andWhere(
      new Brackets((qb) => {
        qb.where("f.requestorId = :userId", { userId: userId }).orWhere(
          "f.requesteeId = :userId",
          { userId: userId }
        );
      })
    );

export const fetchProfilesQuery = (searchQuery: string) =>
  getRepository(User)
    .createQueryBuilder("u")
    .leftJoinAndSelect("u.profilePhoto", "photo")
    .where(
      new Brackets((qb) => {
        qb.where("u.name ILIKE :name", { name: `%${searchQuery}%` })
          .orWhere("u.email ILIKE :email", { email: `%${searchQuery}%` })
          .orWhere("u.username ILIKE :username", {
            username: `%${searchQuery}%`,
          });
      })
    );
