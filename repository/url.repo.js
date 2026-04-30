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

        const [result] = await UrlModel.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    urls: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: "clicks",        // your clicks collection name
                                localField: "_id",
                                foreignField: "url",
                                as: "clickDetails"
                            }
                        },
                        { $addFields: { totalClicks: { $size: "$clickDetails" } } },
                        { $project: { clickDetails: 0 } }  // drop the array, keep only count
                    ],
                    total: [
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const urls = result.urls;
        const count = result.total[0]?.count || 0;
        const pages = Math.ceil(count / limit);

        return { urls, pagination: { limit, page, total: count, pages } };
    }
}