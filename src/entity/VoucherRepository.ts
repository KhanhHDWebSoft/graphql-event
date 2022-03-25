import { EntityRepository, Repository } from "typeorm";
import { Voucher } from "./Voucher";

@EntityRepository(Event)
export class VoucherRepository extends Repository<Voucher> {}
