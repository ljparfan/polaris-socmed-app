import { Response, Router } from "express";
import { Comment } from "../entities/comment.entity";
import { Like } from "../entities/like.entity";
import { Post } from "../entities/post.entity";
import { LikeInput } from "../inputs/like.input";
import isAuthenticated from "../middlewares/auth.middleware";
import validateRequestBody from "../middlewares/validator.middleware";
import logger from "../utils/logging.utils";
import { Request } from "../utils/types";

const likeRoutes = Router();

const likeOrUnlikeCommentOrPost = async (req: Request, res: Response) => {
  const idType = req.body.postId ? "postId" : "commentId";

  let like = await Like.findOne({
    [idType]: req.body[idType],
    userId: req.user!.userId,
  });
  if (like) {
    //unlike
    const result = await Like.softRemove(like);
    return res.send(result);
  } else {
    //like
    like = Like.create({
      [idType]: req.body[idType],
      userId: req.user!.userId,
    });
    like = await like.save();
    return res.send(like);
  }
};

likeRoutes.post(
  "/",
  isAuthenticated,
  validateRequestBody(Like),
  async (req: Request, res) => {
    logger.info("entering route to add a like with request body:", req.body);
    const body: LikeInput = req.body;

    if (body.postId) {
      logger.info("entering route to like a post:", req.body);
      const exists = !!(await Post.count({ id: body.postId }));
      if (!exists) {
        logger.info("post not found");
        return res.status(404).send({ error: { message: "Post not found" } });
      }

      return await likeOrUnlikeCommentOrPost(req, res);
    } else {
      logger.info("entering route to like a comment:", req.body);
      const exists = !!(await Comment.count({ id: body.commentId }));
      if (!exists) {
        logger.info("comment not found");
        return res
          .status(404)
          .send({ error: { message: "Comment not found" } });
      }
      return await likeOrUnlikeCommentOrPost(req, res);
    }
  }
);

export default likeRoutes;
