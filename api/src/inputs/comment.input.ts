import { IsNotEmpty } from "class-validator";

export class CommentInput {
  @IsNotEmpty()
  value: string;
}
