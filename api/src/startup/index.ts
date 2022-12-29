import "reflect-metadata";
import config from "config";
import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { createConnection } from "typeorm";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "../routes/auth.routes";
import commentRoutes from "../routes/comment.routes";
import friendshipRoutes from "../routes/friendship.routes";
import likeRoutes from "../routes/like.routes";
import postRoutes from "../routes/post.routes";
import profileRoutes from "../routes/profile.routes";
import userRoutes from "../routes/user.routes";
import logger from "../utils/logging.utils";
import { Comment } from "../entities/comment.entity";
import { Friendship } from "../entities/friendship.entity";
import { Like } from "../entities/like.entity";
import { Photo } from "../entities/photo.entity";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";

export const initializeDatabase = async () => {
  const dbConfig = config.get<Parameters<typeof createConnection>[0]>(
    "Database.connection"
  );

  const configObj: Parameters<typeof createConnection>[0] = {
    ...dbConfig,
    entities: [Comment, Friendship, Like, Photo, Post, User],
    synchronize: true,
    logging: true,
  };

  if (process.env.NODE_ENV === "production") {
    configObj.extra.ssl = {
      rejectUnauthorized: false,
    };
  }

  const connection = await createConnection(configObj);
  logger.info(`successfully connected to db: ${dbConfig.database}`);

  return connection;
};

export const initializeFirebase = async () => {
  const serviceAccount = config.get<ServiceAccount & { private_key: string }>(
    "Firebase.serviceAccount"
  );

  const app = initializeApp({
    credential: cert({
      ...serviceAccount,
      private_key: serviceAccount["private_key"]!.replace(/\\n/gm, "\n"),
    } as any),
  });
  logger.info("successfully initialized firebase");

  return app;
};

export const initializeRoutes = () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.CLIENT_BASE_URL,
      credentials: true,
    })
  );
  app.use(express.json());

  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/posts/:postId/comments", commentRoutes);
  app.use("/api/likes", likeRoutes);
  app.use("/api/friendships", friendshipRoutes);
  app.use("/api/profiles", profileRoutes);

  logger.info("successfully initialized routes");

  const port = process.env.PORT || 4000;
  return app.listen(port, () => {
    logger.info(`server started on port ${port}`);
  });
};
