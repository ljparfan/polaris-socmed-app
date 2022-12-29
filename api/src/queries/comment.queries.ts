import { getRepository } from "typeorm";
import { Comment } from "../entities/comment.entity";

export const fetchCommentsQuery = (userId: number, postKey: string) =>
  getRepository(Comment)
    .createQueryBuilder("c")
    .loadRelationCountAndMap("c.likesCount", "c.likes", "like", (qb) =>
      qb.where("like.deletedAt IS NULL")
    )
    .loadRelationCountAndMap("c.likedByCurrentUser", "c.likes", "like", (qb) =>
      qb.where("like.userId = :currentUserId", {
        currentUserId: userId,
      })
    )
    .innerJoinAndSelect("c.user", "user")
    .innerJoin("c.post", "p")
    // .where("p.id = :postKey", { postKey: req.params.postId })
    .where("p.key = :postKey", { postKey });
