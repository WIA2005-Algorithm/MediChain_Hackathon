import { Router } from "express";
import { HospitalEntity } from "../models/Entity.model.js";
import { log } from "../models/Utilities.model.js";
import { getAccessToken } from "../server_config.js";
import errors, { response } from "../Utils/Errors.js";
const router = Router();
// CREATION OF ADMIN ENTITY INSIDE CREATE ORGANISATION START NETWORK
router.post("/login", (req, res) => {
    let user = null,
        session = null;
    const userID = req.body.userID,
        password = req.body.password,
        type = req.body.type;
    HospitalEntity.findOne({ userID })
        .exec()
        .then((u) => {
            user = u;
            console.log(user.userID);
            if (user.password)
                return user.comparePassword(`${password}@${userID}`);
            return user.compareAlternate(`${password}@${userID}`);
            // user.comparePassword(`${req.body.password}@${req.body.userID}`, (_, isMatch) => {

            // })
        })
        .then((isMatch) => {
            console.log("Is Match for Password? : ", isMatch);
            if (!isMatch) {
                throw new Error();
            }
            return user.compareType(`${password}@${type}`);
        })
        .then((isMatch) => {
            console.log("Is Match for Type? : ", isMatch);
            if (!isMatch) {
                throw new Error();
            }
            session = getAccessToken({
                username: userID,
                role: type,
                org: user.organization,
                key: password,
            });

            return HospitalEntity.findByIdAndUpdate(user._id, {
                //TODO: Add remove alternate and add new password key
                refreshToken: session.refreshToken,
            });
        })
        .then(() => res.status(200).json({...session, org: user.organization}))
        .catch((err) => {
            err = errors.invalid_auth.withDetails(
                `Username/Password is incorrect : ${err.message}`
            );
            return res.status(err.status).json(new response.errorResponse(err));
        });
});

export default router;
