import { NextFunction, Response } from "express";
import { Request } from "../utils/types";
import { Post } from "../entities/post.entity";

const postExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.postId) {
    return res
      .status(400)
      .send({ error: { message: "Please send a valid post id." } });
  }

  const post = await Post.findOne(
    { key: req.params.postId },
    {
      relations: ["comments"],
    }
  );

  if (!post) {
    return res.status(404).send({ error: { message: "Post not found" } });
  }

  req.post = post;

  return next();
};

export default postExists;
