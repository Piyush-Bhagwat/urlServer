import { Router } from "express"
import { UrlRouter } from "./urlRoutes.js";
import { UserRouter } from "./user.routes.js";

const router = Router();

router.use("/url", UrlRouter);
router.use("/user", UserRouter);

export { router }