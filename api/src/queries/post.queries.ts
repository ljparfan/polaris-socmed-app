import { getRepository } from "typeorm";
import { Post } from "../entities/post.entity";

export const fetchPostsQuery = (userId: number, friendIds: number[]) =>
  getRepository(Post)
    .createQueryBuilder("p")
    .loadRelationCountAndMap("p.commentsCount", "p.comments", "comment", (qb) =>
      qb.where("comment.deletedAt IS NULL")
    )
    .loadRelationCountAndMap("p.likesCount", "p.likes", "like", (qb) =>
      qb.where("like.deletedAt IS NULL")
    )
    .leftJoinAndSelect("p.user", "user")
    .leftJoinAndSelect("user.profilePhoto", "profilePhoto")
    .leftJoinAndSelect("p.photos", "photo")
    .loadRelationCountAndMap("p.likedByCurrentUser", "p.likes", "like", (qb) =>
      qb.where("like.userId = :currentUserId", {
        currentUserId: userId,
      })
    )
    .where("p.userId IN (:...userIds)", { userIds: friendIds });
