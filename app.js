import { config } from "dotenv"

import connectDB from "./config/config.db.js";
import express, { json, urlencoded } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { router } from "./routes/index.js";
import { UrlController } from "./controllers/url.controller.js";
import { errorHandler } from "./middlewares/error.handler.js";

config()
const log = console.log;
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // Max 10 requests per IP per minute
    message: { message: "Too many requests, please try again later." },
    headers: true, // Sends rate limit info in headers
});

const app = express();

connectDB();

app.use(limiter);
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/api", router);

app.get("/:shortUrl", UrlController.openUrl);
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
    log("Server Started on PORT: ", process.env.PORT);
});
