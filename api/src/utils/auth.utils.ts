import { sign } from "jsonwebtoken";
import { Response } from "express";
import config from "config";
import { User } from "../entities/user.entity";
import logger from "./logging.utils";

export const createAccessToken = (user: User) =>
  sign({ userId: user.id }, config.get<string>("Auth.accessToken"), {
    expiresIn: "1d",
  });

export const createRefreshToken = (user: User) => {
  logger.info("Encoding user details to token:", user);

  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    config.get<string>("Auth.refreshToken"),
    {
      expiresIn: "20d",
    }
  );
};

export const sendRefreshToken = (res: Response, user: User) => {
  const token = createRefreshToken(user);
  logger.info("Sending token", { token });

  res.cookie("jid", token, {
    httpOnly: true,
    // path: "/api/auth/access-token",
  });
};
