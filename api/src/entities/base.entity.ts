import {
  BaseEntity as TypeOrmBaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Generated("uuid")
  key: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt = new Date();

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt = new Date();

  @DeleteDateColumn({ type: "timestamp with time zone" })
  deletedAt: Date;
}
