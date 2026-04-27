import { Router } from "express"
import { UrlRouter } from "./urlRoutes.js";
import { UserRouter } from "./user.routes.js";

const router = Router();

router.use((req, res, next) => {
    console.log(`Reqested for (${req.method}) api${req.url}`);
    next()
})

router.use("/url", UrlRouter);
router.use("/user", UserRouter);

export { router }