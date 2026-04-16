import { UrlModel } from "../models/model.url.js";

export const UrlRepo = {
    async create({ originalURL, expTime, shortID }) {
        const url = await UrlModel.create({
            originalURL,
            shortID,
            clicks: 0,
            expiresAt: expTime
                ? new Date(Date.now() + expTime * 1000)
                : undefined,
        });

        return url;
    },

    async get({ filter, limit = 10, page = 1 }) {
        const skip = limit * (page - 1);
        const urls = await UrlModel.find(filter).sort({ createdAt: -1 }).limit(skip);

        return urls;
    }
}