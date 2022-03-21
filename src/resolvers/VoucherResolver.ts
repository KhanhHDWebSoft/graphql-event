import { Event } from "../entity/Event";
import { Voucher } from "../entity/Voucher";
import { Repository } from "typeorm";
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
    const voucherCode = Math.floor(Math.random() * 1000);
    const event = await Event.findOne({
      where: {
        id: params.eventId,
      },
    });
    if (event) {
      const data = Voucher.create({
        voucher_code: voucherCode + "_voucher",
        event,
      });
      await Voucher.save(data);

      await sendMail(
        "khanhng3009@gmail.com",
        "your voucher number is " + voucherCode
      );
    }

    return true;
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
