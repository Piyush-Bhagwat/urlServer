import jwt from "jsonwebtoken";
import { UserRepo } from "../repository/user.repo.js";
import { UserService } from "../service/user.service.js";
import { ApiError, ApiResponse, asyncHandler } from "../util/asyncHandler.util.js";
import { UserModel } from "../models/user.model.js";

export const UserController = {
    signup: asyncHandler(async (req, res) => {
        const { displayName, userName, email, password } = req.body;

        const user = await UserService.create({ displayName, userName, password, email });

        return res.status(201).json(new ApiResponse(201, { user }, "User creatued"))
    }),
    login: asyncHandler(async (req, res) => {
        const { userName, email, password } = req.body;

        if (!userName && !email) {
            throw new ApiError(400, "email or username requried");
        }

        if (!password) {
            throw new ApiError(400, "Password required");
        }

        const user = await UserRepo.getUser({ userName, email });

        console.log(typeof user); // should be object
        console.log(user instanceof UserModel); // should be true
        console.log(user.comparePasswords); // should be function
        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const correctPass = user.comparePasswords(password);
        if (!correctPass) {
            throw new ApiError(404, "User not found")
        }

        const payload = {
            userName: user.userName,
            email: user.email,
            displayName: user.displayName,
            _id: user._id
        }

        const token = await jwt.sign(payload, process.env.JWT_SECRET);

        user.lastLogin = new Date();

        await user.save();

        return res.status(200).json(new ApiResponse(200, { token, ...payload }, "User logged in"))

    }),
    getUser: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const user = await UserRepo.getUser({ email: id, id, userName: id });
        return res.status(200).json(new ApiResponse(200, { user }, "User Fetched"))
    }),

}