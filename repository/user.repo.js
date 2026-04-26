import mongoose from "mongoose";
import { API_MESSAGES } from "../constants/apiErrorMessages.js";
import { UserModel } from "../models/user.model.js"
import { ApiError } from "../util/asyncHandler.util.js";

export const UserRepo = {
    async create({ displayName, userName, email, password, displayPhoto, }) {
        if (!email || !userName || !password) {
            throw ApiError(400, "Missing fields: userName, Email, password");
        }
        const user = await UserModel.create({ displayName, userName, email, password, displayPhoto });

        return user;
    },

    async getUserStrict({ userName, id, email, isActive = true }) {
        const filters = [];

        if (id) filters.push({ _id: id });
        if (email) filters.push({ email });
        if (userName) filters.push({ userName });

        if (filters.length === 0) {
            throw new ApiError(400, "At least one identifier required");
        }

        const user = await UserModel.findOne({
            $and: filters,
            isActive
        });

        if (!user) {
            throw new ApiError(400, API_MESSAGES.USER.NOT_FOUND);
        }

        return user;
    },

    async getUser({ userName, id, email, isActive = true }) {
        const filters = [];

        if (email) filters.push({ email });
        if (userName) filters.push({ userName });

        if (id && mongoose.Types.ObjectId.isValid(id)) {
            filters.push({ _id: id });
        }

        if (filters.length === 0) {
            throw new ApiError(400, "At least one identifier required");
        }

        return await UserModel.findOne({
            $or: filters,
            isActive
        });
    },

    async getConflictingUser({ email, userName }) {
        const users = await UserModel.find({
            $or: [{ email }, { userName }]
        });

        const conflicts = {
            email: false,
            userName: false
        };

        users.forEach(user => {
            if (user.email === email) conflicts.email = true;
            if (user.userName === userName) conflicts.userName = true;
        });

        return conflicts;
    }

}