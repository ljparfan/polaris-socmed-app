import { verify } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import config from "config";
import { Payload, Request } from "../utils/types";
import logger from "../utils/logging.utils";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    logger.error("authorization header not found in request");
    return res.status(401).send({
      error: {
        message: "Unauthorized",
      },
    });
  }

  try {
    const [, token] = authorization.split(" ");
    const payload = verify(token, config.get("Auth.accessToken"));
    req.user = payload as Payload;
  } catch (error) {
    logger.error("error occurred in verifying / decoding access token");
    return res.status(401).send({
      error: {
        message: "Unauthorized",
      },
    });
  }

  return next();
};

export default isAuthenticated;
