import { User } from "../entities/user.entity";
import { Router } from "express";
import argon2 from "argon2";
import { RegisterInput } from "../inputs/register.input";
import validateRequestBody from "../middlewares/validator.middleware";
import isAuthenticated from "../middlewares/auth.middleware";
import { Request } from "../utils/types";
import {
  filesMiddleware,
  getPhotoUrl,
  getStorageBucket,
} from "../utils/storage.utils";
import { Photo } from "../entities/photo.entity";
import logger from "../utils/logging.utils";

const userRoutes = Router();

userRoutes.post(
  "/",
  filesMiddleware.single("photo"),
  validateRequestBody(RegisterInput),
  async (req, res) => {
    logger.info("entering sign up endpoint");
    async function createUser(photoId?: number) {
      const { password, ...otherFields }: RegisterInput = req.body;
      const hashedPassword = await argon2.hash(password);
      let user = User.create({ ...otherFields, password: hashedPassword });
      if (photoId) {
        user.profilePhotoId = photoId;
      }
      return await User.save(user);
    }

    const photoFile = req.file;

    if (photoFile) {
      logger.info("profile photo is provided");
      const photo = Photo.create({
        extension: photoFile.originalname.substring(
          photoFile.originalname.lastIndexOf(".") + 1
        ),
      });

      await photo.save();
      logger.info("photo file details generated: ", photo);

      const blob = getStorageBucket().file(`${photo.key}.${photo.extension}`);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        logger.error("Error occurred when uploading file:", err);
        res.status(500).send({
          error: { message: "An unexpected error occurred.", details: err },
        });
      });

      blobStream.on("finish", async () => {
        photo.fileName = blob.name;
        await photo.save();

        const url = await getPhotoUrl(photo.fileName);
        photo.imageUrl = url;

        const user = await createUser(photo.id);

        user.profilePhoto = photo;

        const response: Partial<User> = { ...user };

        delete response.password;
        delete response.tokenVersion;

        logger.info("successfully created a user with profile photo");

        res.send(response);
      });

      blobStream.end(photoFile.buffer);
    } else {
      const response: Partial<User> = { ...(await createUser()) };

      delete response.password;
      delete response.tokenVersion;

      logger.info("successfully created a user without profile photo");
      res.send(response);
    }
  }
);

userRoutes.get("/me", isAuthenticated, async (req: Request, res) => {
  logger.info("entering route to get current user");
  const user = await User.findOne(req.user!.userId, {
    relations: ["profilePhoto"],
  });
  if (!user) {
    logger.error("user id from token payload not found");
    return res.status(401).send({
      error: {
        message: "Unauthorized",
      },
    });
  }

  if (user.profilePhoto) {
    logger.info("profile photo exists for current user");
    user.profilePhotoUrl = await getPhotoUrl(user.profilePhoto.fileName);
  }

  const {
    password: _password,
    tokenVersion: _tokenVersion,
    ...otherFields
  }: Partial<User> = user;

  return res.send(otherFields);
});

export default userRoutes;
