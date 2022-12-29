import { Column, Entity, ManyToOne } from "typeorm";
import { FriendshipStatus } from "../models/friendship-status.enum";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity({ name: "friendships" })
export class Friendship extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sentFriendships)
  requestor: User;

  @Column()
  requestorId: number;

  @ManyToOne(() => User, (user) => user.receivedFriendships)
  requestee: User;

  @Column()
  requesteeId: number;

  @Column({ default: FriendshipStatus.PENDING })
  status: FriendshipStatus;
}
