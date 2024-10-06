import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import userRouter from "./routes/userRoutes.js";
import snippetRouter from "./routes/snippetRoutes.js";
import templateRouter from "./routes/templateRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.set("trust proxy", process.env.NODE_ENV === "production" ? true : false);

const limiter = rateLimit({
  max: 1000,
  // 1 hour.
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(mongoSanitize());

app.use(xss());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.PRODUCTION_URL,
    credentials: true,
  })
);

app.options("*", cors());

app.use(cookieParser());

// Prevent parameter pollution
// Parameter pollution is a type of attack where an attacker sends multiple parameters with the same name. This can cause the server to behave unexpectedly.
// We can whitelist certain parameters that are allowed to be duplicated. Such as the duration parameter. Ex. duration=5&duration=9
app.use(
  hpp({
    // The whitelist option is used to specify the parameters that are allowed to be duplicated.
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the CMS API!");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/snippets", snippetRouter);
app.use("/api/v1/templates", templateRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
