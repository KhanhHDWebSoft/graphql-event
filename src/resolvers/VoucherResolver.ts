import { Voucher } from "src/entity/Voucher";
import { Arg, Mutation, Resolver } from "type-graphql";

interface voucherParams {
  eventId: string;
}

// @Resolver()
// export class VoucherResolver {
//   @Mutation(() => Boolean)
//   async generateVoucher(@Arg("generateVoucherParams") voucherParams: voucherParams) {
//     const voucherCode = Math.floor(Math.random() * 1000);
//     await Voucher.create({
//       voucher_code: "voucher" + voucherCode,
//       event: voucherParams.eventId
//     });
//     return true;
//   }
// }
