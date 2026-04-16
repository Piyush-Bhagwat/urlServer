import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        default: "User Name",
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false
    },
    displayPhoto: {
        type: String,
        trim: true,
        default: null
    },
    limits: {
        urls: { type: Number, default: 30 }
    },
    lastLogin: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
};


const UserModel = mongoose.model("User", userSchema);


export { UserModel }