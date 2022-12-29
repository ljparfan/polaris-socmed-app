import { NextFunction, Response } from "express";
import { validateOrReject } from "class-validator";
import { Request } from "../utils/types";
import { ClassConstructor, plainToClass } from "class-transformer";
import logger from "../utils/logging.utils";

const validateRequestBody =
  <T>(InputClass: ClassConstructor<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("entering middleware to validate request body");
    req.body = plainToClass(InputClass, req.body);
    try {
      await validateOrReject(req.body);
      next();
    } catch (error) {
      res.status(400).send({
        validationErrors: error,
      });
    }
  };

export default validateRequestBody;
