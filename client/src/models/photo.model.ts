import { BaseModel } from "./base.model";

export interface Photo extends BaseModel {
  imageUrl: string;
  fileName: string;
  extension: string;
}
