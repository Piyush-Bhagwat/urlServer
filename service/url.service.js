import mongoose from "mongoose";
import { UrlRepo } from "../repository/url.repo.js";
import { generateID } from "../util/util.randomID.js";
import { UrlModel } from "../models/model.url.js";
import { ClickModel } from "../models/click.model.js";
//CONTINUE: sprint2 1.3
export const UrlService = {
    async create({ originalURL, alias = null, expTime, user }) {
        console.log("[SHORTEN] ", { originalURL, alias, expTime });
        const shortID = alias ?? await generateID();
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
    async getAll({ user, paginationInfo }) {
        if (!mongoose.isValidObjectId(user)) {
            throw new Error("User id required");
        }
        const { urls, pagination } = await UrlRepo.get({ filter: { user, isDeleted: false }, limit: paginationInfo.limit, page: paginationInfo.page });

        return { urls, pagination }
    },
    async stats(urlId) {
        const lastWeekDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [clicksCount, last7Days, topReferrers, topCountries] = await Promise.all([

            // total clicks
            ClickModel.countDocuments({ url: urlId }),

            // clicks per day for last 7 days
            ClickModel.aggregate([
                { $match: { url: urlId, createdAt: { $gt: lastWeekDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),

            // top 5 referrers
            ClickModel.aggregate([
                { $match: { url: urlId } },
                { $group: { _id: "$referrer", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),

            // top 5 countries
            ClickModel.aggregate([
                { $match: { url: urlId } },
                { $group: { _id: "$country", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),
        ]);

        return { clicksCount, last7Days, topReferrers, topCountries };
    }
}