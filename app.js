import { config } from "dotenv"

import connectDB from "./config/config.db.js";
import express, { json, urlencoded } from "express";

import cors from "cors";
import rateLimit from "express-rate-limit";
import { router } from "./routes/index.js";
import { UrlController } from "./controllers/url.controller.js";
import { errorHandler } from "./middleware/error.handler.js";
import { createRateLimiter } from "./middleware/rateLimiter.middlerware.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
config()
const log = console.log;

const app = express();
const redirectLimiter = createRateLimiter(60, 1, "Too many requests.");

connectDB();

app.use(helmet());
app.use(mongoSanitize());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.get("/:shortUrl", redirectLimiter, UrlController.openUrl);

app.use("/api", router);

app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
    log("Server Started on PORT: ", process.env.PORT);
});
