import { UserRepo } from "../repository/user.repo.js"
import { ApiError } from "../util/asyncHandler.util.js";

export const UserService = {
    async create({ displayName, userName, email, password, displayPhoto }) {
        const exisitingUser = await UserRepo.getConflictingUser({ userName, email });

        if (exisitingUser.email) {
            throw new ApiError(409, "Account already exist with email");
        }

        if (exisitingUser.userName) {
            throw new ApiError(409, "Account already exist with userName");
        }

        const user = await UserRepo.create({ displayName, userName, password, email, displayPhoto });
        delete user.password;

        return user.toObject()
    }
}