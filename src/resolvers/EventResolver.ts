import { Event } from "../entity/Event";
import {
  Arg,
  Mutation,
  Resolver,
  Query,
  InputType,
  Field,
  Int,
} from "type-graphql";

@InputType()
class EventInput {
  @Field()
  eventName: string;

  @Field({ nullable: true })
  totalVoucher?: number;

  @Field({ nullable: true })
  voucherCount?: number;
}

@InputType()
class UpdateEventInput {
  @Field()
  eventName: string;

  @Field({ nullable: true })
  totalVoucher?: number;
}

@Resolver()
export class EventResolver {
  @Mutation(() => Event)
  async createEvent(@Arg("eventParams") eventParams: EventInput) {
    const { eventName, totalVoucher, voucherCount } = eventParams;
    const data = await Event.create({
      event_name: eventName,
      count_voucher: voucherCount,
      total_voucher: totalVoucher,
    }).save();

    return data;
  }

  @Mutation(() => Boolean)
  async updateEvent(
    @Arg("eventId", () => Int) id: number,
    @Arg("eventUpdateParams") eventUpdateParams: UpdateEventInput
  ) {
    const { totalVoucher, eventName } = eventUpdateParams;
    let updatedEvent;
    const event = await Event.findOne({
      where: {
        id,
      },
    });
    if (event) {
      if (!totalVoucher) {
        updatedEvent = await Event.update(
          {
            id,
          },
          {
            event_name: eventName,
          }
        );
      }
      if (totalVoucher && totalVoucher < event.count_voucher) {
        throw new Error(
          "Current vouchers is higher than your new total voucher"
        );
      }

      if (totalVoucher && totalVoucher >= event.count_voucher) {
        updatedEvent = await Event.update(
          { id },
          { event_name: eventName, total_voucher: totalVoucher }
        );
      }
    }

    return Boolean(updatedEvent);
  }

  @Mutation(() => Boolean)
  async deleteEvent(@Arg("id", () => Int) id: number) {
    await Event.delete({ id });
    return true;
  }

  @Query(() => [Event])
  events() {
    return Event.find();
  }
}
