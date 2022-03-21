import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn = async ({ context }: any, next) => {
  if (context.req.session.userId) {
    throw new Error("not authenticated");
  }

  return next();
};
