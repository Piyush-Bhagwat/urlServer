import express from "express";
import { UrlController } from "../controllers/url.controller.js";
import { authenticate } from "../middleware/auth.middlewware.js";


const UrlRouter = express.Router();

UrlRouter.use(authenticate);
UrlRouter.get("/", UrlController.get);
UrlRouter.post("/", UrlController.create);

UrlRouter.delete("/:id", UrlController.delete);
UrlRouter.patch("/:id", UrlController.update);

export { UrlRouter };
