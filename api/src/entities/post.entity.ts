import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";
import { Photo } from "./photo.entity";
import { User } from "./user.entity";

@Entity({ name: "posts" })
export class Post extends BaseEntity {
  @Column()
  value!: string;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Photo, (photo) => photo.post)
  photos: Photo[];

  @ManyToOne(() => User, (user) => user.posts)
  user!: User;

  @Column()
  userId: number;

  likesCount: number;
  commentsCount: number;
  likedByCurrentUser: boolean;
}
