import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middlewware.js";
import { ApiResponse, asyncHandler } from "../util/asyncHandler.util.js";
import { validate } from "../middleware/validator.middleware.js";
import { UserValidator } from "../validators/user.validator.js";

const UserRouter = Router();

UserRouter.post("/signup", validate(UserValidator.create), UserController.signup)
UserRouter.post("/login", validate(UserValidator.login), UserController.login)
UserRouter.get("/me", authenticate, asyncHandler(async (req, res) => {
    console.log("~ User", req.user.displayName);
    return res.status(200).json(new ApiResponse(200, { user: req.user }, "User Fetched"))
}))

export { UserRouter }