import mongoose from "mongoose";
import { UrlRepo } from "../repository/url.repo.js";
import { generateID } from "../util/util.randomID.js";

export const UrlService = {
    async create({ originalURL, expTime, user }) {
        const shortID = await generateID();
        const existing = await UrlModel.findOne({
            shortID,
            $or: [
                { expiresAt: { $gt: new Date() } }, // not expired
                { expiresAt: null }                  // no expiry set
            ]
        });

        if (existing) {
            // shortID is genuinely in use — retry with new ID
            throw { code: 11000 };
        }
        console.log("[URL] ShortID: ", shortID, "OriginalURL: ", originalURL);

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