import { Request as ExpressRequest } from "express";
import { Post } from "../entities/post.entity";

export type Payload = {
  userId: number;
  tokenVersion: number;
};

export type Request = ExpressRequest & { user?: Payload; post?: Post };
