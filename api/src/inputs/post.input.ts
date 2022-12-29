import { IsNotEmpty } from "class-validator";

export class PostInput {
  @IsNotEmpty()
  value: string;
}
