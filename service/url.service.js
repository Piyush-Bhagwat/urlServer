import { UrlRepo } from "../repository/url.repo.js";
import { generateID } from "../util/util.randomID.js";

export const UrlService = {
    async create({ originalURL, expTime }) {
        const shortID = await generateID();
        console.log("ShortID: ", shortID, "OriginalURL: ", originalURL);

        await UrlRepo.create({ originalURL, expTime, shortID })


        return shortID
    },
    async getAll() {
        const urls = await UrlRepo.get();

        return urls
    }
}