// Configuration file for express server port & Firebase Database
"use strict";
import assert from "assert";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import express, { json } from "express";
import cors from "cors";
import { Superuser } from "./models/Network.model.js";
import errors, { response } from "./Utils/Errors.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(json());
const {
    PORT,
    HOST,
    HOST_URL,
    DATABASE_URI,
    ACCESS_TOKEN,
    REFRESH_ACCESS_TOKEN,
} = process.env;

export function getAccessToken(user, refresh = true) {
    const token = jwt.sign(user, ACCESS_TOKEN, { expiresIn: "10m" });
    if (refresh)
        return {
            accessToken: token,
            refreshToken: jwt.sign(user, REFRESH_ACCESS_TOKEN),
        };
    return token;
}

app.post("/api/update-token", (req, res) => {
    const err = errors.required_auth.withDetails("The token is not valid");
    console.log("Called Me");
    Superuser.findOne({ refreshToken: req.body.refreshToken }).exec(
        (_, doc) => {
            if (!doc)
                return res
                    .status(err.status)
                    .json(new response.errorResponse(err));
            jwt.verify(
                req.body.refreshToken,
                REFRESH_ACCESS_TOKEN,
                (_, user) => {
                    if (!user)
                        return res
                            .status(err.status)
                            .json(new response.errorResponse(err));
                    return res.status(200).json({
                        accessToken: getAccessToken(
                            { username: user.username, role: user.role },
                            false
                        ),
                        refreshToken: req.body.refreshToken,
                    });
                }
            );
        }
    );
});

export function authenticateUser(req, res, next) {
    const authToken = req.headers.authorization;
    if (authToken == null)
        return res
            .status(401)
            .json(
                new response.errorResponse(
                    errors.invalid_auth.withDetails("null")
                )
            );
    jwt.verify(authToken, ACCESS_TOKEN, (_, user) => {
        if (!user)
            return res
                .status(401)
                .json(
                    new response.errorResponse(
                        errors.invalid_permission.withDetails("null")
                    )
                );
        req.user = user;
        next();
    });
}

assert(PORT, "Port is required");
assert(HOST, "Host is required");
assert(DATABASE_URI, "Database URI is required");
export { app };
export const port = PORT;
export const host = HOST;
export const url = HOST_URL;
export const dbURI = DATABASE_URI;
