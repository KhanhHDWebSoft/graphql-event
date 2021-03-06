import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./Event";

@ObjectType()
@Entity()
export class Voucher extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  voucher_code: string;

  @ManyToOne(() => Event, (event) => event.voucher)
  @JoinColumn({ name: "event_id" })
  event: Event;
}
