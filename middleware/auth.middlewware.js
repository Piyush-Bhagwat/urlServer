import jwt from "jsonwebtoken";
import { API_MESSAGES } from "../constants/apiErrorMessages.js";
import { ApiError, asyncHandler } from "../util/asyncHandler.util.js";
import { UserRepo } from "../repository/user.repo.js";


export const authenticate = asyncHandler(async (req, res, next) => {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
        throw new ApiError(401, "Authorization header missing");
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new ApiError(401, "Invalid authorization format");
    }

    let payload;
    try {
        payload = jwt.verify(token, "OurKeyBois");
    } catch (err) {
        throw new ApiError(401, "Invalid or expired token");
    }

    const userDoc = await UserRepo.getUser({ id: payload._id });
    if (!userDoc) {
        throw new ApiError(404, API_MESSAGES.USER.NOT_FOUND)
    }

    req.user = payload;

    console.log("[AUTH] ", { user: req.user.userName })


    next();
});