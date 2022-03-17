import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Event extends BaseEntity {
  @Field(() => Int, { nullable: true })
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
}
