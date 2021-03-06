"use strict";

import express from "express";
import session from "express-session";
// takes care of mongo connections and maintains health checks
import mongo from "connect-mongo";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import bluebird from "bluebird";
import helmet from "helmet";
import errorHandler from "errorhandler";
import { allowCrossDomain, checkAuthentication  } from "./middleware";
import { login, register, currentUser, logout } from "./controllers/auth";
import { MONGO_URI, SESSION, PORT } from "./utils/secrets";

dotenv.config({ path: ".env"});

const MongoStore = mongo(session);
const mongoURL = MONGO_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoURL, { useNewUrlParser: true }).then(() => {
	/* Mongoose is connected to MongoDB */
}).catch((err) => {
	console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
});

// creating Express server
const app = express();

// Setting express variables
app.set("port", PORT || 3000);
app.use(errorHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.use(allowCrossDomain);
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: SESSION,
	store: new MongoStore({
		url: mongoURL,
		autoReconnect: true,
	})
}));

app.get("/", (req, res) => { res.json("You are the one!"); });
app.post("/login", login);
app.post("/register", register);
app.get("/currentuser", checkAuthentication, currentUser);
app.post("/logout", checkAuthentication, logout);

export default app;