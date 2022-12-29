import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Post } from "./post.entity";

@Entity({ name: "photos" })
export class Photo extends BaseEntity {
  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  extension: string;

  @ManyToOne(() => Post, (post) => post.photos)
  post: Post;
  @Column({ nullable: true })
  postId: number;

  imageUrl?: string;
}
