import { Router } from "express";
import {
    addMember,
    createAdminEntity,
    deleteAdminEntity,
} from "../controllers/Entity.controller.js";
import { RegisterUser } from "../controllers/register.js";
import { getHashedUserID, HospitalEntity } from "../models/Entity.model.js";
import { Organizations } from "../models/Network.model.js";
import { log } from "../models/Utilities.model.js";
import { getAccessToken } from "../server_config.js";
import errors, { response } from "../Utils/Errors.js";
const router = Router();

const loginHelper = (data) => {
    const newSession = getAccessToken(data);
    return {
        session: newSession,
        next: () =>
            HospitalEntity.findByIdAndUpdate(data._id, {
                //TODO: Add remove alternate and add new password key
                refreshToken: newSession.refreshToken,
            }),
    };
};
// CREATION OF ADMIN ENTITY INSIDE CREATE ORGANISATION START NETWORK
router.post("/login", (req, res) => {
    console.log("hello...I am here");
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
            if (!user.password)
                return res.status(200).json({
                    isOnBehalf: 1,
                    org: user.organization,
                    loginDetails: {
                        user: userID,
                    },
                });

            const LoginHelp = loginHelper({
                _id: user._id,
                username: userID,
                role: type,
                org: user.organization,
                key: password,
            });
            console.log(LoginHelp);
            session = LoginHelp.session;
            console.log(session);
            LoginHelp.next()
                .then(() =>
                    res.status(200).json({
                        ...session,
                        org: user.organization,
                        isOnBehalf: -1,
                    })
                )
                .catch((err) => {
                    throw new Error(err);
                });
        })
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
    console.log("I am in change");
    const userID = req.body.userID,
        password = req.body.password;
    var user, session;
    HospitalEntity.findOne({ userID })
        .exec()
        .then((u) => {
            user = u;
            if (u.password) return res.status(200).json({ isOnBehalf: -1 });
            HospitalEntity.updateOne(
                { userID },
                { password, alternateKey: [] }
            ).exec();
        })
        .then(() => {
            const LoginHelp = loginHelper({
                _id: user._id,
                username: userID,
                role: user.type,
                org: user.organization,
                key: password,
            });
            session = LoginHelp.session;

            return LoginHelp.next();
        })
        .then(() => {
            res.status(200).json({
                ...session,
                org: user.organization,
            });
        })
        .catch((err) => {
            err = errors.signUpError.withDetails(`${err.message}`);
            return res.status(err.status).json(new response.errorResponse(err));
        });
});
router.post("/addNewPatient/onBehalf", (req, res) => {
    const { loginDetails, personalDetails, address, contactDetails } =
        req.body.payloadData;
    let encryptedID;
    // TYPE IS capitalized after below statement
    const type = `${String(loginDetails.TYPE).charAt(0).toUpperCase()}${String(
        loginDetails.TYPE
    ).slice(1)}`;

    getHashedUserID(loginDetails.ID)
        .then((hash) => {
            encryptedID = hash;
            return RegisterUser(loginDetails.org, encryptedID, type);
        })
        .then(() =>
            createAdminEntity({
                userID: loginDetails.ID,
                alternateKey: loginDetails.password,
                organization: loginDetails.org,
                type: String(type.toLowerCase()),
            })
        )
        .then(() =>
            addMember(loginDetails.org, encryptedID, {
                personalDetails,
                address,
                contactDetails,
            })
        )
        .then(() => res.sendStatus(200))
        .catch(async (err) => {
            await deleteAdminEntity(loginDetails.ID);
            err = errors.signUpError.withDetails(`${err.message}`);
            return res.status(err.status).json(new response.errorResponse(err));
        });
});
export default router;
