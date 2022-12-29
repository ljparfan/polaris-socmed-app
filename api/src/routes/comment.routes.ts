import { Router } from "express";
import { Comment } from "../entities/comment.entity";
import { Post } from "../entities/post.entity";
import { CommentInput } from "../inputs/comment.input";
import isAuthenticated from "../middlewares/auth.middleware";
import postExists from "../middlewares/post-exists.middleware";
import validateRequestBody from "../middlewares/validator.middleware";
import { PaginationRequest } from "../models/pagination-request.model";
import { PaginationResponse } from "../models/pagination-response.model";
import { fetchCommentsQuery } from "../queries/comment.queries";
import logger from "../utils/logging.utils";
import { Request } from "../utils/types";

const commentRoutes = Router({ mergeParams: true });

commentRoutes.get(
  "/",
  isAuthenticated,
  async (req: Request & { query: PaginationRequest }, res) => {
    logger.info("entering route to get comments:", req.query);
    if (!req.query.pageSize || !req.query.pageNumber) {
      return res.status(400).send({
        error: { message: "Query parameters 'page' and 'limit' are required." },
      });
    }

    const page = +req.query.pageNumber;
    const limit = +req.query.pageSize;
    const comments = await fetchCommentsQuery(
      req.user!.userId,
      req.params.postId
    )
      .offset((page - 1) * limit)
      .limit(limit)
      .getMany();

    const totalCount = await fetchCommentsQuery(
      req.user!.userId,
      req.params.postId
    ).getCount();

    const response: PaginationResponse<Comment> = {
      data: comments.map((comment) => {
        comment.likedByCurrentUser = !!comment.likedByCurrentUser;

        return comment;
      }),
      pagination: {
        page,
        totalCount,
      },
    };

    logger.info("exiting route to get comments with response:", response);
    return res.send(response);
  }
);

commentRoutes.post(
  "/",
  isAuthenticated,
  validateRequestBody(CommentInput),
  postExists,
  async (req: Request, res) => {
    logger.info("entering route to add a comment with body:", req.body);
    const comment = Comment.create({
      post: req.post,
      value: req.body.value,
      user: {
        id: req.user!.userId,
      },
    });

    await Comment.save(comment);

    const response = await Comment.findOne(comment.id, { relations: ["user"] });
    logger.info("exiting route to add a comment with response:", response);
    res.send(response);
  }
);

commentRoutes.delete(
  "/:commentId",
  isAuthenticated,
  postExists,
  async (req: Request, res) => {
    logger.info(
      "entering route to delete a comment with id:",
      req.params.commentId
    );
    const comment = req.post!.comments.find(
      (comment) => comment.id === +req.params.commentId
    );

    if (!comment) {
      return res.status(404).send({ error: { message: "Comment not found" } });
    }

    const [deletedComment] = await Comment.softRemove([comment]);

    deletedComment.post = { id: req.post!.id, key: req.post!.key } as Post;

    logger.info(
      "exiting route to delete a comment with response:",
      deletedComment
    );
    return res.send(deletedComment);
  }
);

export default commentRoutes;
