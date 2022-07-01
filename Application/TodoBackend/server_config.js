// Configuration file for express server port & Firebase Database
"use strict";
import assert from "assert";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import express, { json } from "express";
import cors from "cors";
import { Superuser } from "./models/Network.model.js";
import errors, { response } from "./Utils/Errors.js";
import { System_logs } from "./models/Utilities.model.js";
import { HospitalEntity } from "./models/Entity.model.js";
import { Notification, RequestModel } from "./models/NotificationModel.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(json());
const { PORT, HOST, HOST_URL, DATABASE_URI, ACCESS_TOKEN, REFRESH_ACCESS_TOKEN } =
  process.env;

// Initially set the refresh token then afterwards don't update refresh token but only access token, thus refresh=false
export function getAccessToken(user, refresh = true) {
  const token = jwt.sign(user, ACCESS_TOKEN, { expiresIn: "10m" });
  if (refresh)
    return {
      accessToken: token,
      refreshToken: jwt.sign(user, REFRESH_ACCESS_TOKEN)
    };
  return token;
}

const roleBasedTokenVerify = (role, refreshToken) => {
  switch (role) {
    case "admin":
      return HospitalEntity.findOne({ refreshToken }).exec();
    default:
      return Superuser.findOne({ refreshToken }).exec();
  }
};

const getAccessTokenObj = (role, user) => {
  switch (role) {
    case "admin":
      return {
        username: user.username,
        role: user.role,
        org: user.org,
        key: user.key
      };

    default:
      return {
        username: user.username,
        role: user.role
      };
  }
};

export function authenticateUser(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken == null)
    return res
      .status(401)
      .json(
        new response.errorResponse(
          errors.invalid_auth.withDetails(
            "Seems like you have not logged in. Please login to continue"
          )
        )
      );
  jwt.verify(authToken, ACCESS_TOKEN, (_, user) => {
    if (!user)
      return res
        .status(401)
        .json(
          new response.errorResponse(
            errors.invalid_permission.withDetails(
              "Time expired. Please login again to continue"
            )
          )
        );
    req.user = user;
    next();
  });
}

app.post("/api/update-token", authenticateUser, (req, res) => {
  const err = errors.required_auth.withDetails("The token is not valid"),
    role = req.user.role,
    refreshToken = req.body.refreshToken;
  roleBasedTokenVerify(role, refreshToken)
    .then(() => {
      jwt.verify(refreshToken, REFRESH_ACCESS_TOKEN, (err, user) => {
        if (!user) return res.status(err.status).json(new response.errorResponse(err));
        return res.status(200).json({
          accessToken: getAccessToken(getAccessTokenObj(role, user), false),
          refreshToken: req.body.refreshToken
        });
      });
    })
    .catch(() => {
      return res.status(err.status).json(new response.errorResponse(err));
    });
});

app.post("/api/systemLogs", authenticateUser, (req, res) => {
  System_logs.find({ User: req.user.username })
    .sort({ createdAt: -1 })
    .exec((err, doc) => {
      if (!doc) return res.sendStatus(500);
      return res.status(200).json(doc);
    });
});

app.post("/api/markNotificationRead", authenticateUser, (req, res) => {
  Notification.findByIdAndUpdate(req.body._id, { Read: true })
    .exec()
    .then(() => {
      return res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

app.get("/api/getNotificationData", authenticateUser, (req, res) => {
  const ToString = `${req.user.org}#${req.user.role}#${req.user.username}`;
  Notification.find({ To: ToString })
    .sort({ createdAt: -1 })
    .exec()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

app.get("/api/getRequestData", authenticateUser, (req, res) => {
  const ToString = `${req.user.org}#${req.user.role}#${req.user.username}`;
  RequestModel.find({ RID: ToString })
    .sort({ createdAt: -1 })
    .exec()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});
assert(PORT, "Port is required");
assert(HOST, "Host is required");
assert(DATABASE_URI, "Database URI is required");
export { app };
export const port = PORT;
export const host = HOST;
export const url = HOST_URL;
export const dbURI = DATABASE_URI;
