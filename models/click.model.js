import { model, Schema } from "mongoose";

const clickSchema = new Schema({
    url: {
        type: Schema.Types.ObjectId,
        ref: "URL",
        required: true,
    },
    ip: String,
    referrer: String,
    userAgent: String,
    country: String,
}, { timestamps: true })

export const ClickModel = model("Click", clickSchema)