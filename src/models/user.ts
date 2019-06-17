"use strict";

import mongoose, { Schema } from "mongoose";

interface IUser extends Document {
	name: string;
	emailAddress: string;
	username: string;
	password: string;
}

const UserSchema: Schema = new Schema({
	name: {type: String, required: true },
	emailAddress: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true, unique: true }
});

UserSchema.set("versionKey", false);

export default mongoose.model<IUser>("User", UserSchema);