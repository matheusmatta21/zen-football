import compression from "compression";
import express, { type Express } from "express";
import rateLimit from "express-rate-limit";
import routes from "./routes";

const app: Express = express();
const port = 3000;

const TRUST_PROXY_HOPS = Number(process.env.TRUST_PROXY_HOPS ?? 0);

if (TRUST_PROXY_HOPS > 0) {
  app.set("trust proxy", TRUST_PROXY_HOPS);
}

const limiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests, try again in a minute" },
});

app.use(compression());
app.use(express.json());
app.use("/api", limiter, routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
