import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Comment } from "./comment.entity";
import { Post } from "./post.entity";
import { User } from "./user.entity";

@Entity({ name: "likes" })
export class Like extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;
  @Column({ nullable: true })
  postId: number;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment: Comment;
  @Column({ nullable: true })
  commentId: number;

  @ManyToOne(() => User)
  user!: User;
  @Column()
  userId: number;
}
