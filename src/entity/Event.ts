import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Event extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  event_name: string;

  @Column("int", { default: 10, nullable: true })
  total_voucher: number;

  @Column("int", { default: 0, nullable: true })
  count_voucher: number;
}
