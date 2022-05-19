import { Router } from "express";
import {
    addMember,
    createAdminEntity,
} from "../controllers/Entity.controller.js";
import { RegisterUser } from "../controllers/register.js";
import { HospitalEntity } from "../models/Entity.model.js";
import { Organizations } from "../models/Network.model.js";
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
            if (user.password)
                return user.comparePassword(`${password}@${userID}`);
            return user.compareAlternate(`${password}@${userID}`);
        })
        .then((isMatch) => {
            if (!isMatch) {
                throw new Error();
            }
            return user.compareType(`${password}@${type}`);
        })
        .then((isMatch) => {
            if (!isMatch) {
                throw new Error();
            }
            //TODO : LINE 41 in notebook
            if (!user.password) return res.status(200).json({ OnBehalf: true });

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
        .then(() =>
            res.status(200).json({ ...session, org: user.organization })
        )
        .catch((err) => {
            err = errors.invalid_auth.withDetails(
                `Either you are not a verified user or your username/password is incorrect : ${err.message}`
            );
            return res.status(err.status).json(new response.errorResponse(err));
        });
});

/**
 * Get all the enrolled hospitals
 */
router.get("/getEnrolledHospitals", (_, res) => {
    Organizations.find({ Enrolled: 1 })
        .exec()
        .then((data) => {
            const array = [];
            data.forEach((ele) => array.push(`${ele.FullName} - ${ele.Name}`));
            res.status(200).json(array);
        })
        .catch((e) => {
            return res
                .status(500)
                .json({ message: "Unexpected Error Occured" });
        });
});

router.post("/addNewPatient/onBehalf/Change", (req, res) => {
    const userID = req.body.userID,
        password = req.body.password;
    HospitalEntity.findOne({ userID })
        .exec()
        .then(() =>
            HospitalEntity.findOneAndUpdate(
                { userID },
                { password, alternateKey: null }
            ).exec()
        )
        .then(() => res.sendStatus(200))
        .catch((err) => {
            err = errors.signUpError.withDetails(`${err.message}`);
            return res.status(err.status).json(new response.errorResponse(err));
        });
});
router.post("/addNewPatient/onBehalf", (req, res) => {
    const { loginDetails, personalDetails, address, contactDetails } =
        req.body.payloadData;
    const SignupDetails = JSON.parse(loginDetails);
    // TYPE IS capitalized after below statement
    const type = `${String(SignupDetails.TYPE).charAt(0).toUpperCase()}${String(
        SignupDetails.TYPE
    ).slice(1)}`;
    RegisterUser(SignupDetails.org, SignupDetails.ID, type)
        .then(() =>
            createAdminEntity({
                userID: SignupDetails.ID,
                alternateKey: SignupDetails.password,
                organization: SignupDetails.org,
                type: String(type.toLowerCase()),
            })
        )
        .then(() =>
            addMember(SignupDetails.org, SignupDetails.ID, {
                personalDetails,
                address,
                contactDetails,
            })
        )
        .then(() => res.sendStatus(200))
        .catch((err) => {
            err = errors.signUpError.withDetails(`${err.message}`);
            return res.status(err.status).json(new response.errorResponse(err));
        });
});
export default router;
