import { UserService } from "../service/user.service.js";
import { ApiResponse, asyncHandler } from "../util/asyncHandler.util.js";

export const UserController = {
    signup: asyncHandler(async (req, res) => {
        const { displayName, userName, email, password } = req.body;

        const user = await UserService.create({ displayName, userName, password, email });

        return res.status(201).json(new ApiResponse(201, { user }, "User creatued"))
    })
}