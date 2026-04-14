import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    originalURL: {
        type: String,
        required: true,
    },
    queryParams: {
        type: [{
            key: String,
            value: String
        }],
        default: []

    },
    shortID: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        index: { expires: "10m" },
    },
    clicks: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const UrlModel = mongoose.model("URL", urlSchema);

export { UrlModel }