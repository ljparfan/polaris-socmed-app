import { Router } from "express";
import { Post } from "../entities/post.entity";
import { PostInput } from "../inputs/post.input";
import isAuthenticated from "../middlewares/auth.middleware";
import validateRequestBody from "../middlewares/validator.middleware";
import { PaginationRequest } from "../models/pagination-request.model";
import { PaginationResponse } from "../models/pagination-response.model";
import { fetchPostsQuery } from "../queries/post.queries";
import { Request } from "../utils/types";
import { Photo } from "../entities/photo.entity";
import {
  getStorageBucket,
  filesMiddleware,
  getPhotoUrl,
} from "../utils/storage.utils";
import { Friendship } from "../entities/friendship.entity";
import { FriendshipStatus } from "../models/friendship-status.enum";
import logger from "../utils/logging.utils";

const postRoutes = Router();

postRoutes.get(
  "/",
  isAuthenticated,
  async (req: Request & { query: PaginationRequest }, res) => {
    logger.info("entering route to get posts with query params: ", req.query);
    if (!req.query.pageSize || !req.query.pageNumber) {
      return res.status(400).send({
        error: {
          message: "Query parameters 'pageNumber' and 'pageSize' are required.",
        },
      });
    }

    const page = +req.query.pageNumber;
    const limit = +req.query.pageSize;

    const friends = await Friendship.find({
      where: [
        {
          requesteeId: req.user!.userId,
          status: FriendshipStatus.ACCEPTED,
        },
        {
          requestorId: req.user!.userId,
          status: FriendshipStatus.ACCEPTED,
        },
      ],
      select: ["id", "requesteeId", "requestorId"],
    });

    const friendIds = Array.from(
      new Set([
        ...friends.map((profile) => profile.requesteeId),
        ...friends.map((profile) => profile.requestorId),
        req.user!.userId,
      ])
    );

    const posts = await fetchPostsQuery(req.user!.userId, friendIds)
      .orderBy("p.createdAt", "DESC")
      .offset((page - 1) * limit)
      .limit(limit)
      .getMany();

    const postsPromise: Promise<Post>[] = posts.map(
      (post) =>
        new Promise(async (resolve, _reject) => {
          const photosPromise: Promise<Photo>[] = post.photos.map(
            (photo) =>
              new Promise(async (resolve) => {
                const url = await getPhotoUrl(photo.fileName);

                resolve({ imageUrl: url } as Photo);
              })
          );

          if (post.user.profilePhoto) {
            post.user.profilePhotoUrl = await getPhotoUrl(
              post.user.profilePhoto.fileName
            );
          }
          post.likedByCurrentUser = !!post.likedByCurrentUser;
          post.photos = await Promise.all(photosPromise);
          resolve(post);
        })
    );

    const totalCount = await fetchPostsQuery(
      req.user!.userId,
      friendIds
    ).getCount();

    const response: PaginationResponse<Post> = {
      data: await Promise.all(postsPromise),
      pagination: {
        page,
        totalCount,
      },
    };

    logger.info("exiting route to get posts with response:", response);
    return res.send(response);
  }
);

postRoutes.get("/:key", isAuthenticated, async (req: Request, res) => {
  logger.info(
    "entering route to get specific post bey key with key:",
    req.params.key
  );
  const friends = await Friendship.find({
    where: [
      {
        requesteeId: req.user!.userId,
        status: FriendshipStatus.ACCEPTED,
      },
      {
        requestorId: req.user!.userId,
        status: FriendshipStatus.ACCEPTED,
      },
    ],
    select: ["id"],
  });

  const friendIds = Array.from(
    new Set([
      ...friends.map((profile) => profile.requesteeId),
      ...friends.map((profile) => profile.requestorId),
      req.user!.userId,
    ])
  );

  const post = await fetchPostsQuery(req.user!.userId, friendIds)
    .where("p.key = :key", { key: req.params.key })
    .getOne();

  if (!post) {
    logger.error(`post with key of: ${req.params.key} not found`);
    return res.status(404).send({ error: { message: "Post not found" } });
  }

  const photosPromise: Promise<Photo>[] = post.photos.map(
    (photo) =>
      new Promise(async (resolve, _reject) => {
        const url = await getPhotoUrl(photo.fileName);
        resolve({ imageUrl: url } as Photo);
      })
  );

  post.photos = await Promise.all(photosPromise);

  if (post.user.profilePhoto) {
    post.user.profilePhotoUrl = await getPhotoUrl(
      post.user.profilePhoto.fileName
    );
  }

  logger.info("exiting route to get a post by key with response:", post);
  return res.send(post);
});

postRoutes.post(
  "/",
  isAuthenticated,
  filesMiddleware.array("photos"),
  validateRequestBody(PostInput),
  async (req: Request, res) => {
    logger.info("entering route to add a post with body:", req.body);
    let post: Post = req.body;
    post = Post.create({ value: post.value, userId: req.user!.userId });

    post = await post.save();

    const files = req.files as Express.Multer.File[];

    let photos = files.map((file) =>
      Photo.create({
        extension: file.originalname.substring(
          file.originalname.lastIndexOf(".") + 1
        ),
        postId: post.id,
      })
    );
    await Photo.save(photos);

    const photosPromise: Promise<Photo>[] = photos.map(
      (photo, index) =>
        new Promise((resolve, reject) => {
          const blob = getStorageBucket().file(
            `${photo.key}.${photo.extension}`
          );
          const blobStream = blob.createWriteStream();

          blobStream.on("error", (err) => {
            reject(err);
          });

          blobStream.on("finish", async () => {
            photo.fileName = blob.name;
            await photo.save();

            const url = await getPhotoUrl(photo.fileName);
            photo.imageUrl = url;
            logger.info(
              `Successfully uploaded file with filename: ${photo.fileName}`
            );
            resolve(photo);
          });

          blobStream.end(files[index].buffer);
        })
    );

    photos = await Promise.all(photosPromise);

    post = await Post.findOneOrFail(post.id, {
      relations: ["user", "user.profilePhoto"],
    });

    post.photos = photos.map(({ imageUrl }) => ({ imageUrl } as Photo));
    post.commentsCount = 0;
    post.likesCount = 0;
    post.likedByCurrentUser = false;

    if (post.user.profilePhoto) {
      post.user.profilePhotoUrl = await getPhotoUrl(
        post.user.profilePhoto.fileName
      );
    }

    logger.info("exiting route for adding a post with response:", post);
    return res.send(post);
  }
);

postRoutes.delete("/:id", isAuthenticated, async (req: Request, res) => {
  logger.info("entering route to delete a post with id:", req.params.id);
  let post = await Post.findOne(+req.params.id);
  if (!post) {
    logger.error("post with id not found");
    return res.status(404).send({
      error: {
        message: "Resource not found",
      },
    });
  }
  if (post.userId !== req.user!.userId) {
    logger.error(
      "user deleting is not the one who added the post",
      post,
      req.user
    );
    return res.status(403).send({
      error: {
        message: "Forbidden",
      },
    });
  }

  post = (await Post.softRemove([post]))[0];

  logger.info("exiting route to delete a post with response:", post);
  return res.send(post);
});

export default postRoutes;
