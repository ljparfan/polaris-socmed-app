import { Router } from "express";
import argon2 from "argon2";
import config from "config";
import { LoginInput } from "../inputs/login.input";
import { User } from "../entities/user.entity";
import { createAccessToken, sendRefreshToken } from "../utils/auth.utils";
import { getConnection } from "typeorm";
import isAuthenticated from "../middlewares/auth.middleware";
import { Payload, Request } from "../utils/types";
import { verify } from "jsonwebtoken";
import logger from "../utils/logging.utils";

const authRoutes = Router();

authRoutes.post("/", async (req, res) => {
  const { usernameOrEmail, password }: LoginInput = req.body;
  const user = await User.findOne({
    where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    select: ["password", "username", "id", "email", "name", "tokenVersion"],
  });
  logger.info("fetched user with the provided username:", user);

  if (!user) {
    logger.error("user with the provided username or email does not exist.");
    return res.status(400).send({
      error: {
        message: "Incorrect username / password",
      },
    });
  }

  const valid = await argon2.verify(user!.password, password);

  if (!valid) {
    logger.error("user's provided password is incorrect.");
    return res.status(400).send({
      error: {
        message: "Incorrect username / password",
      },
    });
  }

  logger.info(
    "login successful, sending refreshToken and accessToken via cookie and response body"
  );

  sendRefreshToken(res, user!);

  return res.send({
    accessToken: createAccessToken(user!),
  });
});

authRoutes.post(
  "/revoke-refresh-tokens",
  isAuthenticated,
  async (req: Request, res) => {
    await getConnection()
      .getRepository(User)
      .increment({ id: +req.user!.userId }, "tokenVersion", 1);

    logger.info(
      "successfully incremented tokenVersion of user with userId: ",
      +req.user!.userId
    );

    res.send(true);
  }
);

authRoutes.post("/access-token", async (req, res) => {
  const token = req.cookies.jid;

  if (!token) {
    logger.error("token from request cookie jid not found");
    return res.status(401).send({ error: { message: "Unauthorized" } });
  }

  let payload: Payload;
  try {
    payload = verify(token, config.get("Auth.refreshToken")) as Payload;
  } catch (error) {
    logger.error(
      "error occurred when decoding the payload for the gathered refreshToken",
      error
    );
    return res.status(401).send({ error: { message: "Unauthorized" } });
  }

  const user = await User.findOne(payload!.userId, {
    select: ["id", "tokenVersion"],
  });
  if (!user) {
    logger.error(
      "user with given id from refreshToken does not exist. id: ",
      payload!.userId
    );
    return res.status(401).send({ error: { message: "Unauthorized" } });
  }

  logger.info("logging user fetched via id from requestToken: ", user);
  if (user.tokenVersion !== payload!.tokenVersion) {
    logger.error(
      "user's tokenVersion from db is not equal to tokenVersion from payload.",
      user,
      payload
    );
    return res.status(401).send({ error: { message: "Unauthorized" } });
  }

  sendRefreshToken(res, user);

  return res.send({ ok: true, accessToken: createAccessToken(user) });
});

export default authRoutes;
