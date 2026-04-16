import { UrlModel } from "../models/model.url.js";
import { UrlService } from "../service/url.service.js";
import { ApiError, ApiResponse, asyncHandler } from "../util/asyncHandler.util.js";

import { generateID } from "../util/util.randomID.js"

export const UrlController = {
    create: asyncHandler(async (req, res) => {
        const { originalURL, expTime } = req.body;

        if (!originalURL) {
            throw new ApiError(400, "URL is required")
        }
        let attempts = 0;


        while (attempts < 5) {
            try {
                const shortID = await UrlService.create({ originalURL, expTime });
                return res.status(200).json(new ApiResponse(201, { shortID }, "Url Shortned"))
            } catch (err) {
                if (err.code === 11000) {
                    attempts++;
                    continue; // retry with new ID
                }
                throw err; // unknown error
            }
        }

        throw new ApiError(500, "Failed to generate unique short URL");
    }),
    get: asyncHandler(async (req, res) => {
        const urls = await UrlService.getAll();

        res.status(200).json(new ApiResponse(200, { urls }, "Url Fetched"));
    }),
    openUrl: asyncHandler(async (req, res) => {
        const shortURL = req.params.shortUrl;
        const url = await UrlModel.findOne({ shortID: shortURL });
        if (!url) {
            throw new ApiError(404, "Url not found")
        }

        url.clicks++;
        await url.save();
        return res.redirect(url.originalURL);
    })
}