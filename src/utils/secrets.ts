"use strict";

import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
	dotenv.config({
		path: ".env"
	});
}

export const PORT = process.env["PORT"];
export const SESSION = process.env["SESSION_SECRET"];
export const MONGO_URI = process.env["MONGODB_URI_LOCAL"];
export const JWT_SECRET = process.env["JWT_SESSION_SECRET"];


if ( !MONGO_URI || !SESSION || !JWT_SECRET || !PORT ) {
	console.log(".env file has missing attributes");
	process.exit(1);
}
