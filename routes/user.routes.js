import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const UserRouter = Router();

UserRouter.post("/", UserController.signup)

export { UserRouter }