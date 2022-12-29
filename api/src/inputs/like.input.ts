import { IsNumber, Min } from "class-validator";

export class LikeInput {
  @IsNumber()
  @Min(1)
  postId?: number;
  @Min(1)
  @IsNumber()
  commentId?: number;
}
