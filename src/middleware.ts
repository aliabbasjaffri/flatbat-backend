"use strict";

import jwt from "jsonwebtoken";
import { promisify } from "bluebird";
import { JWT_SECRET } from "./utils/secrets";
import { Request, Response, NextFunction } from "express";

// Because jwt library does not return promises
// so using promisify to handle responses in a
// promise-like structure
const verify = promisify(jwt.verify);

// TODO(): use lusca instead
export let allowCrossDomain = (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Headers", "*");

	// intercept OPTIONS method
	if ("OPTIONS" == req.method) {
		res.status(200).send(200);
	}
	else {
		next();
	}
};

export let checkAuthentication = (req: Request, res: Response, next: NextFunction) => {
	// check header or url parameters or post parameters for token
	let token = "";
	if (req.headers.authorization) {
		// substring(7) removes the Bearer_ from the token
		token = req.headers.authorization.substring(7);
	}

	if (!token)
		return res.status(401).send({
			error: "Unauthorized",
			message: "No token provided in the request"
	});

	// verifies secret and checks exp
	verify(token, JWT_SECRET).then((result) => {
		// if everything is good, save to request for use in other routes
		req.userId = result.id;
		next();
	}).catch((err) => {
		return res.status(401).send({
			error: "Unauthorized",
			message: "Failed to authenticate token. Details:" + err
		});
	});
};