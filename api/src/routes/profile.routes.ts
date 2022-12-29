import { Router } from "express";
import { Friendship } from "../entities/friendship.entity";
import { Photo } from "../entities/photo.entity";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import isAuthenticated from "../middlewares/auth.middleware";
import { PaginationResponse } from "../models/pagination-response.model";
import { ProfileResponse } from "../models/profile-response.model";
import { fetchPostsQuery } from "../queries/post.queries";
import {
  fetchFriendsQuery,
  fetchProfilesQuery,
} from "../queries/profile.queries";
import logger from "../utils/logging.utils";
import { getPhotoUrl } from "../utils/storage.utils";
import { Request } from "../utils/types";

const profileRoutes = Router();

profileRoutes.get(
  "/:username/posts",
  isAuthenticated,
  async (req: Request, res) => {
    logger.info(
      "entering route to get posts of profile with username: ",
      req.params.username
    );
    if (!req.query.pageSize || !req.query.pageNumber) {
      return res.status(400).send({
        error: { message: "Query parameters 'page' and 'limit' are required." },
      });
    }

    const page = +req.query.pageNumber;
    const limit = +req.query.pageSize;
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).send({ error: { message: "Profile not found" } });
    }

    const query = fetchPostsQuery(req.user!.userId, [user.id]);

    const posts = await query
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

    const totalCount = await query.getCount();

    const response: PaginationResponse<Post> = {
      data: await Promise.all(postsPromise),
      pagination: {
        page,
        totalCount,
      },
    };

    logger.info(
      "exiting route to get posts of profile with response:",
      response
    );
    return res.send(response);
  }
);

profileRoutes.get(
  "/:username/friends",
  isAuthenticated,
  async (req: Request, res) => {
    logger.info(
      "entering route to get friends of profile with username:",
      req.params.username
    );
    if (!req.query.pageSize || !req.query.pageNumber) {
      return res.status(400).send({
        error: { message: "Query parameters 'page' and 'limit' are required." },
      });
    }

    const page = +req.query.pageNumber;
    const limit = +req.query.pageSize;
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).send({ error: { message: "Profile not found" } });
    }

    const query = fetchFriendsQuery(user.id);

    const friendships = await query
      .offset((page - 1) * limit)
      .limit(limit)
      .getMany();

    const profilesPromise = friendships.map(
      (friendship) =>
        new Promise(async (resolve) => {
          let profile: Partial<ProfileResponse>;

          if (friendship.requesteeId === user.id) {
            profile = {
              id: friendship.requestor.id,
              key: friendship.requestor.key,
              name: friendship.requestor.name,
              username: friendship.requestor.username,
              profilePhotoUrl: friendship.requestor.profilePhoto
                ? await getPhotoUrl(friendship.requestor.profilePhoto.fileName)
                : undefined,
              topFriendsImageUrls: [],
              isCurrentUser: req.user!.userId === friendship.requestor.id,
            };
          } else {
            profile = {
              id: friendship.requestee.id,
              key: friendship.requestee.key,
              name: friendship.requestee.name,
              username: friendship.requestee.username,
              profilePhotoUrl: friendship.requestee.profilePhoto
                ? await getPhotoUrl(friendship.requestee.profilePhoto.fileName)
                : undefined,
              topFriendsImageUrls: [],
              isCurrentUser: req.user!.userId === friendship.requestee.id,
            };
          }

          profile.friendshipWithCurrentUser = await Friendship.findOne({
            where: [
              { requestorId: req.user!.userId, requesteeId: profile.id },
              { requesteeId: req.user!.userId, requestorId: profile.id },
            ],
            order: { updatedAt: "DESC" },
          });

          resolve(profile);
        })
    );

    const profiles = (await Promise.all(profilesPromise)) as ProfileResponse[];

    const totalCount = await query.getCount();

    const response: PaginationResponse<ProfileResponse> = {
      data: profiles,
      pagination: {
        page,
        totalCount,
      },
    };

    logger.info(
      "exiting route to get friends of profile with response of:",
      response
    );

    return res.send(response);
  }
);

profileRoutes.get("/", isAuthenticated, async (req: Request, res) => {
  logger.info(
    "entering route to search for profiles with query: ",
    req.query.searchQuery
  );
  if (!req.query.pageSize || !req.query.pageNumber || !req.query.searchQuery) {
    return res.status(400).send({
      error: {
        message:
          "Query parameters 'pageSize', 'pageNumber', and 'searchQuery' are required.",
      },
    });
  }

  const page = +req.query.pageNumber;
  const limit = +req.query.pageSize;

  const query = fetchProfilesQuery(req.query.searchQuery as string);

  let users = await query
    .andWhere("u.id != :currentUserId", { currentUserId: req.user!.userId })
    .offset((page - 1) * limit)
    .limit(limit)
    .select(["u.id", "u.key", "u.username", "u.name", "photo"])
    .getMany();

  const totalCount = await query.getCount();

  const usersPromise: Promise<User>[] = users.map(
    (user) =>
      new Promise(async (resolve, _reject) => {
        if (user.profilePhoto) {
          user.profilePhotoUrl = await getPhotoUrl(user.profilePhoto.fileName);
        }
        resolve(user);
      })
  );

  users = await Promise.all(usersPromise);

  const response: PaginationResponse<User> = {
    data: users,
    pagination: {
      page,
      totalCount,
    },
  };

  logger.info("exiting route to search for profiles with response: ", response);
  return res.send(response);
});

profileRoutes.get("/:username", isAuthenticated, async (req: Request, res) => {
  logger.info(
    "entering route to get profile details for username:",
    req.params.username
  );
  const user = await User.findOne(
    { username: req.params.username },
    {
      relations: ["profilePhoto"],
      select: ["id", "key", "name", "username", "profilePhoto"],
    }
  );
  if (!user) {
    return res.status(404).send({
      error: {
        message: "Not found",
      },
    });
  }

  if (user.profilePhoto) {
    user.profilePhotoUrl = await getPhotoUrl(user.profilePhoto.fileName);
  }

  const response: Partial<ProfileResponse> = {
    id: user.id,
    key: user.key,
    name: user.name,
    username: user.username,
    profilePhotoUrl: user.profilePhotoUrl,
    topFriendsImageUrls: [],
    isCurrentUser: req.user!.userId === user.id,
  };

  response.friendshipWithCurrentUser = await Friendship.findOne({
    where: [
      { requestorId: req.user!.userId, requesteeId: user.id },
      { requesteeId: req.user!.userId, requestorId: user.id },
    ],
    order: { updatedAt: "DESC" },
  });

  logger.info("exiting route to get profile details with response:", response);
  return res.send(response);
});

export default profileRoutes;
