import mongoose from "mongoose";
import { UrlRepo } from "../repository/url.repo.js";
import { generateID } from "../util/util.randomID.js";

export const UrlService = {
    async create({ originalURL, expTime, user }) {
        const shortID = await generateID();
        console.log("ShortID: ", shortID, "OriginalURL: ", originalURL);

        await UrlRepo.create({ originalURL, expTime, shortID, user })


        return shortID
    },
    async getAll({ user }) {
        if (!mongoose.isValidObjectId(user)) {
            throw new Error("User id required");
        }
        const urls = await UrlRepo.get({ user });

        return urls
    }
}