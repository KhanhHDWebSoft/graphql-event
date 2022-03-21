import {
  Arg,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Resolver,
  Root,
  Ctx,
  Query,
  UseMiddleware,
} from "type-graphql";
import * as bcrypt from "bcryptjs";
import { User } from "../entity/User";
import { Context } from "../types/context";
import { isAuth } from "../middleware/isAuth";

@InputType()
class RegisterParams {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
class LoginParams {
  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.email} + 111`;
  }

  @UseMiddleware(isAuth)
  @Query(() => [User])
  async getUsers() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: any): Promise<User | undefined> {
    if (!ctx.req.session.userId) {
      return undefined;
    }
    return User.findOne(ctx.req.session.userId);
  }

  @Mutation(() => User)
  async register(@Arg("registerParams") registerParams: RegisterParams) {
    const { email, password } = registerParams;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return await user.save();
  }

  @Mutation(() => User)
  async login(
    @Arg("loginParams") loginParams: LoginParams,
    @Ctx() ctx: any
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email: loginParams.email } });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(loginParams.password, user.password);

    if (!valid) {
      return null;
    }

    ctx.req.session.userId = user.id;
    console.log(ctx.req.session, "ctx");
    return user;
  }
}
