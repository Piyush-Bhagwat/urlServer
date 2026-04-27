import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middlewware.js";
import { ApiResponse, asyncHandler } from "../util/asyncHandler.util.js";

const UserRouter = Router();

UserRouter.post("/signup", UserController.signup)
UserRouter.post("/login", UserController.login)
UserRouter.get("/me", authenticate, asyncHandler(async (req, res) => {
    console.log("~ User", req.user.displayName);
    return res.status(200).json(new ApiResponse(200, { user: req.user }, "User Fetched"))
}))

export { UserRouter }