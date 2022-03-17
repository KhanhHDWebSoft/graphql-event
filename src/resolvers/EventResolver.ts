import { Event } from "../entity/Event";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class EventResolver {
  @Mutation(() => Boolean)
  CreateEevent(@Arg("eventName", () => String) eventName: string) {
    console.log("EVENT NAME", eventName);
    Event.insert({ event_name: eventName });
    return true;
  }
}
