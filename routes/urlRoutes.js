import express from "express";
import { UrlController } from "../controllers/url.controller.js";


const UrlRouter = express.Router();

UrlRouter.post("/shorten", UrlController.create);

UrlRouter.get("/recents", UrlController.get);

export { UrlRouter };
