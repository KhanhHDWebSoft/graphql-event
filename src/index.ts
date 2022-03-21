import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { EventResolver } from "./resolvers/EventResolver";
import { VoucherResolver } from "./resolvers/VoucherResolver";
import { UserResolver } from "./resolvers/UserRevolver";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";

const RedisStore = connectRedis(session);

(async () => {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:4000/graphql",
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  const options = await getConnectionOptions(
    process.env.NODE_ENV || "development"
  );
  await createConnection({ ...options, name: "default" });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [EventResolver, VoucherResolver, UserResolver],
      validate: true,
      authChecker: ({ context }, roles) => {
        // here we can read the user from context
        // and check his permission in the db against the `roles` argument
        // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
        const { req } = context;

        return Boolean(req.session.userId);
      },
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  const port = process.env.PORT || 4000;
  app.listen(port, async () => {
    console.log(`server started at http://localhost:${port}/graphql`);
  });
})();
