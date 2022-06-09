import { Router } from "express";
import {
  addMember,
  assign,
  checkIn,
  createEntity,
  deleteAdminEntity,
  dischargeORCheckOutPatient,
  retriveAllDoctors,
  retriveAllPatients
} from "../controllers/Entity.controller.js";
import { RegisterUser } from "../controllers/register.js";
import { getHashedUserID, GetHashOf, HospitalEntity } from "../models/Entity.model.js";
import { Organizations } from "../models/Network.model.js";
import { log } from "../models/Utilities.model.js";
import { authenticateUser, getAccessToken } from "../server_config.js";
import errors, { response } from "../Utils/Errors.js";
const router = Router();

const loginHelper = (data) => {
  const newSession = getAccessToken(data);
  return {
    session: newSession,
    next: () =>
      HospitalEntity.findByIdAndUpdate(data._id, {
        //TODO: Add remove alternate and add new password key
        refreshToken: newSession.refreshToken
      })
  };
};
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
      if (user.password) return user.comparePassword(`${password}@${userID}`);
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
          user: userID
        });

      const LoginHelp = loginHelper({
        _id: user._id,
        username: userID,
        role: type,
        org: user.organization
      });
      session = LoginHelp.session;
      LoginHelp.next()
        .then(() => {
          log(
            `${userID}`,
            `Login Successfull`,
            `Login for the user with userID: ${userID} and role: [${type.toUpperCase()}] was successful`,
            "success"
          );
          return res.status(200).json({
            ...session,
            org: user.organization,
            isOnBehalf: -1
          });
        })
        .catch((err) => {
          throw new Error(err);
        });
    })
    .catch((err) => {
      err = errors.invalid_auth.withDetails(
        `Either you are not a verified user or your username/password is incorrect`
      );
      log(
        `${userID}`,
        `Login failed`,
        `Login for the user with userID: ${userID} and role: [${type.toUpperCase()}] failed with error - ${
          err.status
        }`,
        "error"
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
      return res.status(200).json(array);
    })
    .catch((e) => {
      return res.status(500).json({ message: "Unexpected Error Occured" });
    });
});

router.post("/addNewPatient/onBehalf/Change", (req, res) => {
  const userID = req.body.userID,
    password = req.body.password;
  var user, session, newType, newPassword;
  HospitalEntity.findOne({ userID })
    .exec()
    .then(async (u) => {
      user = u;
      console.log(" check 1");
      if (u.password) return res.status(200).json({ isOnBehalf: -1 });
      // If not then update alternate to null and add new real password
      var results = await GetHashOf(`${password}@${u.type}`)
        .then((hash) => {
          console.log(" check 2");
          newType = hash;
          return GetHashOf(`${password}@${userID}`);
        })
        .then((hash) => {
          console.log(" check 3");
          newPassword = hash;
          return HospitalEntity.updateOne(
            { userID },
            { password: newPassword, type: newType, alternateKey: [] }
          ).exec();
        });

      if (results) return results;
      throw new Error();
    })
    .then(() => {
      console.log(" check 4");
      const LoginHelp = loginHelper({
        _id: user._id,
        username: userID,
        role: user.type,
        org: user.organization
      });
      session = LoginHelp.session;
      return LoginHelp.next();
    })
    .then(() => {
      log(
        `${userID}`,
        `Alternate Password Changed Successfully`,
        `Alternate password change for the user with userID: ${userID} and role: [${user.type.toUpperCase()}] was successful`,
        "clear"
      );
      return res.status(200).json({
        ...session,
        org: user.organization
      });
    })
    .catch((err) => {
      err = errors.signUpError.withDetails(`${err.message}`);
      log(
        `${userID}`,
        `Alternate Password Change Attempted`,
        `Alternate password change for the user with userID: ${userID} and role: [${user.type.toUpperCase()}] failed`,
        "error"
      );
      return res.status(err.status).json(new response.errorResponse(err));
    });
});
router.post("/addNewPatient/onBehalf", (req, res) => {
  const { loginDetails, personalDetails, address, contactDetails } = req.body.payloadData;
  // As In doctor's signup --> Organization is in the format of "NAME - SHORTFORMID"
  if (!req.body.onBehalf)
    loginDetails.org = String(loginDetails.org.split("-")[1]).trim();
  console.log(" REACHED HERE...");
  let encryptedID;
  // TYPE IS capitalized after below statement
  const type = `${String(loginDetails.TYPE).charAt(0).toUpperCase()}${String(
    loginDetails.TYPE
  ).slice(1)}`;

  getHashedUserID(loginDetails.ID)
    .then((hash) => {
      console.log(" HERE 2;", loginDetails.org);
      encryptedID = hash;
      return RegisterUser(loginDetails.org, loginDetails.ID, type);
    })
    .then(() =>
      createEntity({
        userID: loginDetails.ID,
        organization: loginDetails.org,
        type: String(type.toLowerCase()),
        alternateKey: req.body.onBehalf ? loginDetails.password : [],
        password: req.body.onBehalf ? null : loginDetails.password
      })
    )
    .then(() => {
      console.log(personalDetails);
      addMember(
        loginDetails.org,
        loginDetails.ID,
        {
          personalDetails,
          address,
          contactDetails
        },
        type === "Patient" ? "addPatientEHR" : "addDoctor"
      );
    })
    .then(() => {
      log(
        `${req.user.username}`,
        `Sign Up Successful`,
        `New Sign Up for userID: ${
          loginDetails.ID
        } and role: [${type.toUpperCase()}] was successful`,
        "add"
      );
      return res.sendStatus(200);
    })
    .catch(async (err) => {
      await deleteAdminEntity(loginDetails.ID);
      err = errors.signUpError.withDetails(err);
      log(
        `${req.user.username}`,
        `New Sign Up Attempted`,
        `Sign up attempted for userID: ${userID} and role: [${user.type.toUpperCase()}] failed`,
        "error"
      );
      return res.status(err.status).json(new response.errorResponse(err));
    });
});

router.get("/getAllPatients", authenticateUser, (req, res) => {
  console.log("CREDENTIALS -->>>>", req.user.org, req.user.username);
  retriveAllPatients(req.user.org, req.user.username)
    .then((patients) => res.status(200).json(patients))
    .catch((err) => {
      err = errors.contract_error.withDetails(
        `Either it's an internet issue or you do not have the access rights to  this feature`
      );
      return res.status(err.status).json(new response.errorResponse(err));
    });
});

router.get("/getAllDoctors", authenticateUser, (req, res) => {
  retriveAllDoctors(req.user.org, req.user.username)
    .then((docs) => res.status(200).json(docs))
    .catch((err) => {
      err = errors.contract_error.withDetails(
        `Either it's an internet issue or you do not have the access rights to  this feature`
      );
      return res.status(err.status).json(new response.errorResponse(err));
    });
});

router.post("/checkInPatient", authenticateUser, (req, res) => {
  console.log(" Recieved the request to checkin");
  HospitalEntity.findOne({ userID: req.body.patientID })
    .exec()
    .then((user) => {
      console.log(user.password);
      if (!user.password)
        throw errors.patient_not_logged.withDetails(
          "Patient cannot be checked in before the patient doesn't change his password provided by hospital organization"
        );
      else return checkIn(req.user.org, req.user.username, req.body.patientID);
    })
    .then(() => {
      log(
        `${req.user.username}`,
        `Patient Check In Successful`,
        `New Patient Check In for userID: ${req.body.patientID} was successful`,
        "success"
      );
      return res.sendStatus(200);
    })
    .catch((err) => {
      log(
        `${req.user.username}`,
        `Patient Check In Attempted`,
        `New Patient Check In for userID: ${req.body.patientID} failed`,
        "error"
      );
      console.log(err);
      return res.status(err.status).json(new response.errorResponse(err));
    });
});

router.post("/assignPatient", authenticateUser, (req, res) => {
  assign(req.user.org, req.user.username, req.body.patientID, req.body.doctorID)
    .then(() => {
      log(
        `${req.user.username}`,
        `Patient Was Assigned to Doctor`,
        `New Patient Assignment for userID: ${req.body.patientID} was successful`,
        "add"
      );
      return res.sendStatus(200);
    })
    .catch((err) => {
      log(
        `${req.user.username}`,
        `Patient Check In Attempted`,
        `New Patient Assignment for userID: ${req.body.patientID} failed`,
        "error"
      );
      return res.status(err.status).json(new response.errorResponse(err));
    });
});

router.post("/discharge", authenticateUser, (req, res) => {
  dischargeORCheckOutPatient(req.user.org, req.user.username, req.body.patientID)
    .then(() => {
      log(
        `${req.user.username}`,
        `Patient Was Discharged Successfully`,
        `Existing Patient Dischargement for userID: ${req.body.patientID} was successful`,
        "removecircle"
      );
      return res.sendStatus(200);
    })
    .catch((err) => {
      log(
        `${req.user.username}`,
        `Patient Dischargement Attempted`,
        `Existing Patient Dischargement for userID: ${req.body.patientID} failed with error 500`,
        "removecircle"
      );
      return res.status(err.status).json(new response.errorResponse(err));
    });
});
export default router;
