import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Comment } from "./comment.entity";
import { Friendship } from "./friendship.entity";
import { Like } from "./like.entity";
import { Photo } from "./photo.entity";
import { Post } from "./post.entity";

@Entity({ name: "app_users" })
export class User extends BaseEntity {
  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ default: 0, select: false })
  tokenVersion!: number;

  @Column()
  name!: string;

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Friendship, (friendship) => friendship.requestor)
  sentFriendships: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.requestee)
  receivedFriendships: Friendship[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToOne(() => Photo)
  @JoinColumn()
  profilePhoto: Photo;

  @Column({ nullable: true })
  profilePhotoId: number;

  profilePhotoUrl?: string;
}
