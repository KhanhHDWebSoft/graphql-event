import { EntityRepository, Repository } from "typeorm";
import { Event } from "./Event";

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {}
