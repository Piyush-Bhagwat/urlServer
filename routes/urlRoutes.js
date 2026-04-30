import express from "express";
import { UrlController } from "../controllers/url.controller.js";
import { authenticate } from "../middleware/auth.middlewware.js";
import { createRateLimiter, defaultRateLimiter } from "../middleware/rateLimiter.middlerware.js";


const UrlRouter = express.Router();

const createUrlLimiter = createRateLimiter(20, 15, "Too many URLs created, slow down.");


UrlRouter.use(authenticate);
UrlRouter.post("/", createUrlLimiter, UrlController.create);

UrlRouter.use(defaultRateLimiter);
UrlRouter.get("/", UrlController.get);
UrlRouter.delete("/:id", UrlController.delete);
UrlRouter.patch("/:id", UrlController.update);

export { UrlRouter };
