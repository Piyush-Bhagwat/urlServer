import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    originalURL: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
    },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    clicks: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const UrlModel = mongoose.model("URL", urlSchema);

export { UrlModel }