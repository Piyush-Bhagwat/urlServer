import { config } from "dotenv"
config();
import { connect } from "mongoose";

const connectDB = async () => {
    try {
        await connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
