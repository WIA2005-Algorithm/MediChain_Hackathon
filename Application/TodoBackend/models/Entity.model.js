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

EntityType.pre("save", function (next) {
    var user = this;
    // HASH TYPE FIRST
    if (!user.isModified("password") && !user.isModified("type")) return next();
    bcrypt
        .hash(`${user.password}@${user.type}`, SALT_WORK_FACTOR)
        .then((hash) => {
            user.type = hash;
            if (user.alternateKey[0])
                return bcrypt.hash(
                    `${user.alternateKey[0]}@${user.userID}`,
                    SALT_WORK_FACTOR
                );
            else
                return bcrypt.hash(
                    `${user.password}@${user.userID}`,
                    SALT_WORK_FACTOR
                );
        })
        .then((hash) => {
            if (user.alternateKey[0]) user.alternateKey = [hash, new Date()];
            else user.password = hash;
            next();
        })
        .catch((err) => next(err));
});

EntityType.methods.comparePassword = function (EPassword) {
    return bcrypt.compare(EPassword, this.password);
};
EntityType.methods.compareType = function (EType) {
    return bcrypt.compare(EType, this.type);
};
// bcrypt.compare(EType, this.type, function (err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
// });

EntityType.methods.compareAlternate = function (EAlternate) {
    return bcrypt.compare(EAlternate, this.alternateKey[0]);
};
// bcrypt.compare(EAlternate, this.alternateKey[0], function (err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
// });

export const HospitalEntity = mongoose.model("HospitalEntity", EntityType);
