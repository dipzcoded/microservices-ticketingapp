import express, { Express } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

// error handler
import { errorHandler } from "@realmtickets/common";
import { NotFoundError } from "@realmtickets/common";

const app: Express = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.all("*", async () => {
  throw new NotFoundError("route not found!");
});
app.use(errorHandler);

export { app };
