import { Router } from "express"
import { UrlRouter } from "./urlRoutes.js";

const router = Router();

router.use("/url", UrlRouter);

export { router }