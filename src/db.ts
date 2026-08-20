import { model, Schema } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const mongoURL = process.env.MONGO_URI;

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
});

export const UserModel = model("User", UserSchema);
