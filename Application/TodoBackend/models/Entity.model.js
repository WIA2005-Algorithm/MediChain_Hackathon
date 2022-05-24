"use-strict";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { SALT_WORK_FACTOR } from "../Utils/NetworkConstants.js";
const { Schema } = mongoose;

const EntityType = new Schema(
    {
        userID: { type: String, required: true, index: { unique: true } },
        password: { type: String, default: null },
        organization: { type: String, required: true },
        type: { type: String, required: true },
        alternateKey: { type: Array, default: null },
        refreshToken: { type: String },
    },
    { timestamps: true }
);
const runOnEntityLogin = (user, next) => {
    console.log("lol", user.alternateKey, user.password);
    const pass = user.alternateKey[0] ? user.alternateKey[0] : user.password;
    // HASH TYPE FIRST
    bcrypt
        .hash(`${pass}@${user.type}`, SALT_WORK_FACTOR)
        .then((hash) => {
            user.type = hash;
            return bcrypt.hash(`${pass}@${user.userID}`, SALT_WORK_FACTOR);
        })
        .then((hash) => {
            if (user.alternateKey[0]) user.alternateKey = [hash, new Date()];
            else user.password = hash;
            next();
        })
        .catch((err) => next(err));
};
EntityType.pre("updateOne", function (next) {
    runOnEntityLogin(this, next);
});

EntityType.pre("save", function (next) {
    runOnEntityLogin(this, next);
});

EntityType.methods.comparePassword = function (EPassword) {
    return bcrypt.compare(EPassword, this.password);
};
EntityType.methods.compareType = function (EType) {
    return bcrypt.compare(EType, this.type);
};
EntityType.methods.compareAlternate = function (EAlternate) {
    return bcrypt.compare(EAlternate, this.alternateKey[0]);
};

export const HospitalEntity = mongoose.model("HospitalEntity", EntityType);
export const getHashedUserID = async (userID) =>
    await bcrypt.hash(userID, SALT_WORK_FACTOR);
