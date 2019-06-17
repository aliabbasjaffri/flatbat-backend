"use strict";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../utils/secrets";

export const login = (req: Request, res: Response) => {
	if (!Object.prototype.hasOwnProperty.call(req.body, "password")) return res.status(400).json({
		error: "Bad Request",
		message: "The request body must contain a password property"
	});

	if (!Object.prototype.hasOwnProperty.call(req.body, "username")) return res.status(400).json({
		error: "Bad Request",
		message: "The request body must contain a username property"
	});

	User.findOne({username: req.body.username}).exec()
		.then(user => {
			// check if the password is valid
			const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
			if (!isPasswordValid) return res.status(401).send({token: undefined });

			// if user is found and password is valid
			// create a token
			const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
				expiresIn: 86400 // expires in 24 hours
			});
			res.status(200).json({token: token});
		})
		.catch(error => res.status(404).json({
			error: "User Not Found",
			message: error.message
		}));
};

export const register = (req: Request, res: Response) => {
	console.log(req.body);

	if (!Object.prototype.hasOwnProperty.call(req.body, "password")) return res.status(400).json({
		error: "Bad Request",
		message: "The request body must contain a password property"
	});

	if (!Object.prototype.hasOwnProperty.call(req.body, "username")) return res.status(400).json({
		error: "Bad Request",
		message: "The request body must contain a username property"
	});

	const user = Object.assign(req.body, {password: bcrypt.hashSync(req.body.password, 8)});

	User.create(user)
		.then(user => {
			// if user is registered without errors
			// create a token
			const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
				expiresIn: 86400 // expires in 24 hours
			});
			res.status(200).json({token: token});
		})
		.catch(error => {
			if (error.code == 11000) {
				res.status(400).json({
					error: "User exists",
					message: error.message
				});
			}
			else {
				res.status(500).json({
					error: "Internal server error",
					message: error.message
				});
			}
		});
};

export const currentUser = (req: Request, res: Response) => {
	User.findById(req.userId).select("username").exec()
		.then(user => {
			if (!user) return res.status(404).json({
				error: "Not Found",
				message: `User not found`
			});
			res.status(200).json(user);
		})
		.catch(error => res.status(500).json({
			error: "Internal Server Error",
			message: error.message
		}));
};

export let logout = (req: Request, res: Response) => {
	res.status(200).send({ token: undefined });
};