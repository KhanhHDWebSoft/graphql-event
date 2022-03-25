import { Event } from "../entity/Event";
import { Voucher } from "../entity/Voucher";
import { Repository, getConnection, getManager } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import {
  Arg,
  Mutation,
  Resolver,
  Query,
  InputType,
  Field,
  Int,
  FieldResolver,
  Root,
  Authorized,
  Ctx,
} from "type-graphql";
import { sendMail } from "../utils/sendmail";
import { EventRepository } from "src/entity/EventRepository";
import { ApolloError } from "apollo-server-express";
import { VoucherRepository } from "src/entity/VoucherRepository";

@InputType()
class VoucherParams {
  @Field()
  eventId: number;
}

@Resolver((of) => Voucher)
export class VoucherResolver {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>
  ) {}

  @Mutation(() => Boolean)
  async generateVoucher(@Arg("params") params: VoucherParams, @Ctx() ctx: any) {
    // const connection = getConnection();
    // const queryRunner = connection.createQueryRunner();
    // await queryRunner.connect();
    let voucher = new Voucher();
    await getManager().transaction(async (transactionEntityManager) => {
      const eventRepository =
        transactionEntityManager.getCustomRepository(EventRepository);
      const event = await eventRepository.findOne(params.eventId);

      if (!event) {
        throw new ApolloError("Event not found");
      }

      eventRepository.update(
        {
          id: event.id,
        },
        {
          count_voucher: event.count_voucher + 1,
        }
      );

      const updatedEvent = await eventRepository.findOne(params.eventId);

      if (updatedEvent) {
        if (updatedEvent?.count_voucher >= updatedEvent?.total_voucher) {
          throw new ApolloError("Sold out");
        }
        const voucherCode = Math.floor(Math.random() * 1000);

        const voucherRepository =
          transactionEntityManager.getCustomRepository(VoucherRepository);
        const newVoucher = await voucherRepository.create({
          voucher_code: voucherCode + "_code",
          event: updatedEvent,
        });

        voucher = await newVoucher.save();
      }
    });

    return voucher;
  }

  // @Query(() => [Voucher])
  // @FieldResolver(() => [Voucher])
  // async getVouchersByEventId(@Root() event: Event): Promise<Voucher[]> {
  //   return await Voucher.find({
  //     where: {
  //       event: {
  //         id: event.id,
  //       },
  //     },
  //   });
  // }

  @Authorized()
  @Query(() => [Voucher])
  async getVouchers(): Promise<Voucher[]> {
    return await Voucher.find();
  }
}
