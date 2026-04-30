import { API_MESSAGES } from "../constants/apiErrorMessages.js";
import { ClickModel } from "../models/click.model.js";
import { UrlModel } from "../models/model.url.js";
import { UrlService } from "../service/url.service.js";
import { ApiError, ApiResponse, asyncHandler } from "../util/asyncHandler.util.js";
import geoip from "geoip-lite"


export const UrlController = {
    create: asyncHandler(async (req, res) => {
        const { originalURL, expTime, alias } = req.body;

        if (!originalURL) {
            throw new ApiError(400, "URL is required")
        }
        let attempts = 0;
        let maxAttempts = alias ? 1 : 5;


        while (attempts < maxAttempts) {
            try {
                const shortID = await UrlService.create({ originalURL, alias, expTime, user: req.user._id });
                return res.status(201).json(new ApiResponse(201, { shortID }, "Url Shortned"))
            } catch (err) {
                if (err.code === 11000) {
                    attempts++;
                    continue; // retry with new ID
                }
                throw err; // unknown error
            }
        }

        throw new ApiError(500, "Failed to generate unique short URL; please try again");
    }),
    get: asyncHandler(async (req, res) => {
        const urls = await UrlService.getAll({ user: req.user?._id, isDeleted: false });

        res.status(200).json(new ApiResponse(200, { urls }, "Url Fetched"));
    }),
    openUrl: asyncHandler(async (req, res) => {
        const shortURL = req.params.shortUrl;
        console.log({ shortURL })
        const url = await UrlModel.findOne({ shortID: shortURL, isDeleted: false, isActive: true });
        if (!url) {
            throw new ApiError(404, "Url not found")
        }

        if (url.expiresAt && url.expiresAt < new Date()) {
            throw new ApiError(410, "URL is expired")
        }
        const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
        const userAgent = req.headers["user-agent"] || "Unknown";

        const geo = geoip.lookup(ip);
        const country = geo?.country || "Unknown";
        const referrer = req.headers["referer"] || "Direct";

        ClickModel.create({ url: url._id, ip, userAgent, country, referrer });
        return res.redirect(url.originalURL);
    }),
    delete: asyncHandler(async (req, res) => {
        const id = req.params.id;

        console.log("[DELETE] ", { id, user: req.user })

        const url = await UrlModel.findOne({ user: req.user._id, shortID: id });

        console.log("[DELETE] ", { url })
        if (!url) {
            throw new ApiError(404, API_MESSAGES.URL.NOT_FOUND)
        }

        url.isDeleted = true;
        await url.save();

        return res.status(200).json(new ApiResponse(200, { url }, "URL Deleted"))

    }),
    update: asyncHandler(async (req, res) => {
        const id = req.params.id;
        const { expTime, isActive, url } = req.body;

        const urlDoc = await UrlModel.findOne({
            shortID: id,
            user: req.user._id,
            isDeleted: false
        });

        if (!urlDoc) {
            throw new ApiError(404, API_MESSAGES.URL.NOT_FOUND);
        }

        if (url !== undefined) {

            try {
                new URL(url);
            } catch {
                throw new ApiError(400, "Invalid URL format");
            }
            urlDoc.originalURL = url;
        }

        if (expTime !== undefined) urlDoc.expiresAt = expTime;
        if (isActive !== undefined) urlDoc.isActive = isActive;

        await urlDoc.save();

        return res.status(200).json(new ApiResponse(200, { url: urlDoc }, "URL Updated"));
    })
}