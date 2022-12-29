import { Response, Router } from "express";
import { BaseEntity } from "../entities/base.entity";
import { Friendship } from "../entities/friendship.entity";
import { FriendshipInput } from "../inputs/friendship.input";
import isAuthenticated from "../middlewares/auth.middleware";
import validateRequestBody from "../middlewares/validator.middleware";
import { FriendshipStatus } from "../models/friendship-status.enum";
import { PaginationResponse } from "../models/pagination-response.model";
import { ProfileResponse } from "../models/profile-response.model";
import { fetchFriendshipsByUserIdAndStatusQuery } from "../queries/friendship.queries";
import logger from "../utils/logging.utils";
import { getPhotoUrl } from "../utils/storage.utils";
import { Request } from "../utils/types";

const friendshipRoutes = Router();

friendshipRoutes.post(
  "/",
  isAuthenticated,
  validateRequestBody(FriendshipInput),
  async (req: Request, res: Response) => {
    logger.info(
      "entering route for adding friendship request with request body:",
      req.body
    );
    const body: FriendshipInput = req.body;

    if (!body.requesteeId) {
      return res
        .status(400)
        .send({ error: { message: "Requestee ID is empty" } });
    }

    const count = await Friendship.count({
      where: [
        {
          requestorId: req.user!.userId,
          requesteeId: body.requesteeId,
          status: FriendshipStatus.PENDING,
          deletedAt: null,
        },
        {
          requesteeId: req.user!.userId,
          requestorId: body.requesteeId,
          status: FriendshipStatus.PENDING,
          deletedAt: null,
        },
      ],
    });

    if (count > 0) {
      return res.status(400).send({
        error: { message: "A friend request already exists." },
      });
    }

    let friendship = Friendship.create({
      requesteeId: body.requesteeId,
      requestorId: req.user!.userId,
    });

    friendship = await Friendship.save(friendship);

    friendship = await Friendship.findOneOrFail(friendship.id, {
      relations: ["requestor", "requestee"],
    });

    logger.info("Exiting route to add a friendship with response:", friendship);
    return res.send(friendship);
  }
);

friendshipRoutes.put(
  "/:id",
  isAuthenticated,
  validateRequestBody(FriendshipInput),
  async (req: Request, res: Response) => {
    logger.info(
      `entering route to update friendship request with id of ${req.params.id} and request body:`,
      req.body
    );
    const body: FriendshipInput = req.body;

    if (!body.status) {
      return res.status(400).send({ error: { message: "Invalid status" } });
    }

    const id: number = +req.params.id;

    let friendship = await Friendship.findOne(id, {
      relations: ["requestee", "requestor"],
    });

    if (!friendship) {
      return res.status(404).send({ error: { message: "Not found" } });
    }

    if (friendship.requestee.id !== req.user!.userId) {
      return res.status(403).send({ error: { message: "Forbidden" } });
    }

    friendship.status = body.status;

    friendship = await Friendship.save(friendship);

    logger.info(
      `exiting route to update friendship request with response:`,
      friendship
    );
    return res.send(friendship);
  }
);

friendshipRoutes.delete(
  "/:id",
  isAuthenticated,
  async (req: Request, res: Response) => {
    logger.info(
      `entering route to delete friendship request with id:`,
      req.params.id
    );
    const id: number = +req.params.id;

    let friendship = await Friendship.findOne(id, {
      relations: ["requestor"],
    });

    if (!friendship) {
      return res.status(404).send({ error: { message: "Not found" } });
    }

    if (
      ![friendship.requestorId, friendship.requesteeId].includes(
        req.user!.userId
      )
    ) {
      return res.status(403).send({ error: { message: "Forbidden" } });
    }

    // if (friendship.requestor.id !== req.user!.userId) {
    //   return res.status(403).send({ error: { message: "Forbidden" } });
    // }

    friendship = await Friendship.softRemove(friendship);

    logger.info("exiting route to delete friendship response:", friendship);
    return res.send(friendship);
  }
);

friendshipRoutes.get("/", isAuthenticated, async (req: Request, res) => {
  logger.info("entering route to get friendship with queries:", req.query);
  if (!req.query.pageSize || !req.query.pageNumber || !req.query.status) {
    return res.status(400).send({
      error: {
        message:
          "Query parameters 'pageSize', 'pageNumber', and 'status' are required.",
      },
    });
  }

  const page = +req.query.pageNumber;
  const limit = +req.query.pageSize;

  const query = fetchFriendshipsByUserIdAndStatusQuery(
    req.user!.userId,
    req.query.status as FriendshipStatus
  );

  type FriendRequest = Partial<BaseEntity & { profile: ProfileResponse }>;

  const profiles = (
    await query
      .orderBy("f.updatedAt", "DESC")
      .offset((page - 1) * limit)
      .limit(limit)
      .getMany()
  ).map(
    (friendship) =>
      new Promise(async (resolve) => {
        const { requestor } = friendship;
        const item: FriendRequest = {
          id: friendship.id,
          key: friendship.key,
          profile: {
            id: requestor.id,
            name: requestor.name,
            topFriendsImageUrls: [],
            username: requestor.username,
            key: requestor.key,
            friendshipWithCurrentUser: friendship,
            isCurrentUser: requestor.id === req.user!.userId,
          },
        };
        if (requestor.profilePhoto) {
          item.profile!.profilePhotoUrl = await getPhotoUrl(
            requestor.profilePhoto.fileName
          );
        }

        resolve(item);
      })
  );

  const totalCount = await query.getCount();
  const response: PaginationResponse<FriendRequest> = {
    data: (await Promise.all(profiles)) as FriendRequest[],
    pagination: {
      page,
      totalCount,
    },
  };

  logger.info("exiting route to get friendship with response:", response);
  return res.send(response);
});

export default friendshipRoutes;
