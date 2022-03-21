import { Field, Int, ObjectType, ID } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Voucher } from "./Voucher";
@ObjectType()
@Entity()
export class Event extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column()
  event_name: string;

  @Field({ nullable: true })
  @Column("int", { default: 10, nullable: true })
  total_voucher: number;

  @Field({ nullable: true })
  @Column("int", { default: 0, nullable: true })
  count_voucher: number;

  @OneToMany(() => Voucher, (voucher) => voucher.event, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  voucher: Voucher[];
}
