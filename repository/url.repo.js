import { UrlModel } from "../models/model.url.js";

export const UrlRepo = {
    async create({ originalURL, expTime, shortID, user }) {
        const url = await UrlModel.create({
            originalURL,
            shortID,
            user,
            clicks: 0,
            expiresAt: expTime
                ? new Date(Date.now() + expTime * 1000)
                : undefined,
        });

        return url;
    },

    async get({ filter, limit = 10, page = 1 }) {
        const skip = limit * (page - 1);
        const urls = await UrlModel.find(filter).sort({ createdAt: -1 }).limit(limit).skip(skip);
        const count = await UrlModel.countDocuments(filter);
        const pages = Math.ceil(count / limit)
        return { urls, pagination: { limit, page, total: count, pages } };
    }
}