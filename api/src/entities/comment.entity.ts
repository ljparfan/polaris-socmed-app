import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Like } from "./like.entity";
import { Post } from "./post.entity";
import { User } from "./user.entity";

@Entity({ name: "comments" })
export class Comment extends BaseEntity {
  @Column()
  value!: string;

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];

  @ManyToOne(() => Post, (post) => post.comments)
  post!: Post;

  @ManyToOne(() => User)
  user!: User;

  @Column()
  userId: number;

  likesCount: number;
  likedByCurrentUser: boolean;
}
