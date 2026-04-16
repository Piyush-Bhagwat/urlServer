import express from "express";
import { UrlController } from "../controllers/url.controller.js";


const UrlRouter = express.Router();

UrlRouter.post("/", UrlController.create);

UrlRouter.get("/", UrlController.get);

export { UrlRouter };
