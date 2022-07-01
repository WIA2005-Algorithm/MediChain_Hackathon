import { Router } from "express";
import {
  addMember,
  assign,
  checkIn,
  createEntity,
  deleteAdminEntity,
  dischargeORCheckOutPatient,
  getPatientDataStatsTimeLine,
  getPatientDetails,
  patientCheckInCheckOutStats,
  retriveAllDoctors,
  retriveAllPatients
} from "../controllers/Entity.controller.js";
import { RegisterUser } from "../controllers/register.js";
import { CreateNotificationModelObject } from "../controllers/RequestData.controller.js";
import { GetHashOf, HospitalEntity } from "../models/Entity.model.js";
import { Organizations } from "../models/Network.model.js";
import { Notification, RequestModel } from "../models/NotificationModel.js";
import { log } from "../models/Utilities.model.js";
import { authenticateUser, getAccessToken } from "../server_config.js";
import errors, { ApiError, response } from "../Utils/Errors.js";
import { v4 as UID } from "uuid";
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
      if (user.password === null) {
        console.log("hello");
        return res.status(200).json({
          isOnBehalf: 1,
          org: user.organization,
          user: userID
        });
      }

      const LoginHelp = loginHelper({
        _id: user._id,
        username: userID,
        role: type,
        org: user.organization,
        fullOrg: user.FullOrganization
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
            isOnBehalf: -1,
            org: user.organization,
            session
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
router.get("/getEnrolledHospitals", (req, res) => {
  const substract = req.query.substract;
  console.log(substract);
  Organizations.find({ Enrolled: 1 })
    .exec()
    .then((data) => {
      const array = [];
      data.forEach((ele) => {
        if (!substract || substract !== ele.Name)
          array.push(`${ele.FullName} - ${ele.Name}`);
      });
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
      var results = await GetHashOf(`${password}@patient`)
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
      throw new Error("Unexpected Error Occured");
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
  loginDetails.org = [
    loginDetails.org.split("-")[0].trim(),
    loginDetails.org.split("-")[1].trim()
  ];
  console.log(loginDetails.org);
  // TYPE IS capitalized after below statement
  const type = `${String(loginDetails.TYPE).charAt(0).toUpperCase()}${String(
    loginDetails.TYPE
  ).slice(1)}`;
  createEntity({
    userID: loginDetails.ID,
    organization: loginDetails.org[1].trim(),
    FullOrganization: loginDetails.org[0].trim(),
    type: String(type.toLowerCase()),
    alternateKey: req.body.onBehalf ? loginDetails.password : [],
    password: req.body.onBehalf ? null : loginDetails.password
  })
    .then(() => {
      return RegisterUser(loginDetails.org[1], loginDetails.ID, type);
    })
    .then(() => {
      addMember(
        loginDetails.org[1],
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
        `${loginDetails.ID}`,
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
      if (!(err instanceof ApiError))
        err = new ApiError(
          401,
          "Validity Error",
          "There is an unexpected error in the contract.."
        ).withDetails(err.message);
      log(
        `${loginDetails.ID}`,
        `New Sign Up Attempted`,
        `Sign up attempted for userID: ${
          loginDetails.ID
        } and role: [${type.toUpperCase()}] failed`,
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
  checkIn(req.user.org, req.user.username, req.body.patientID)
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

router.post("/checkOutPatient", authenticateUser, (req, res) => {
  HospitalEntity.findOne({ userID: req.body.patientID })
    .exec()
    .then((user) => {
      if (user.password === null)
        throw errors.patient_not_logged.withDetails(
          "Patient cannot be checked out before the patient doesn't change his password provided by hospital organization"
        );
      else {
        return dischargeORCheckOutPatient(
          req.user.org,
          req.user.username,
          req.body.patientID
        );
      }
    })
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
      if (!(err instanceof ApiError))
        err = new ApiError(
          401,
          "Validity Error",
          "There is an unexpected error in the contract.."
        ).withDetails(err.message);
      log(
        `${req.user.username}`,
        `Patient Dischargement Attempted`,
        `Existing Patient Dischargement for userID: ${req.body.patientID} failed with error 500`,
        "removecircle"
      );
      console.log(err);
      return res.status(500).json(new response.errorResponse(err));
    });
});

router.get("/getPatientCheckInCheckOutStats", authenticateUser, (req, res) => {
  patientCheckInCheckOutStats(
    req.user.org,
    req.user.username,
    req.query.fromRange,
    req.query.toRange
  )
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      if (!(err instanceof ApiError))
        err = new ApiError(
          401,
          "Validity Error",
          "There is an unexpected error in the contract.."
        ).withDetails(err.message);
      res.status(err.status).json(new response.errorResponse(err));
    });
});
router.get("/getPatientDataStatsTimeLine", authenticateUser, (req, res) => {
  getPatientDataStatsTimeLine(
    req.user.org,
    req.user.username,
    req.query.fromRange,
    req.query.toRange,
    req.query.time
  )
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      if (!(err instanceof ApiError))
        err = new ApiError(
          401,
          "Validity Error",
          "There is an unexpected error in the contract.."
        ).withDetails(err.message);
      res.status(err.status).json(new response.errorResponse(err));
    });
});
router.get("/getPatientDetails", authenticateUser, (req, res) => {
  console.log(req.query.ID);
  getPatientDetails(req.user.org, req.user.username, req.query.ID)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      if (!(err instanceof ApiError))
        err = new ApiError(
          401,
          "Validity Error",
          "There is an unexpected error in the contract.."
        ).withDetails(err.message);
      res.status(err.status).json(new response.errorResponse(err));
    });
});

router.post("/acceptExternalDoctorRequest", authenticateUser, (req, res) => {
  const { PatientID, FromDoc, FromOrg } = req.body.data;
  const doctors = req.body.selectedEMR;
  const notifObj = req.body.notifObj;
  RequestModel.findOneAndUpdate(
    { RID: `${FromOrg}#doctor#${FromDoc}` },
    { EMRRequested: JSON.stringify(doctors) }
  )
    .exec()
    .then(() => {
      return doctors.forEach(async (ele) => {
        req.body.data.UID = UID();
        const ID = JSON.parse(ele).ID;
        await CreateNotificationModelObject({
          To: `${req.user.org}#doctor#${ID}`,
          From: `Hospital Admin#${req.user.org}#admin#${req.user.username}`,
          NotificationString: `The hospital admin is requesting your access to share the data of patient with ID : ${PatientID} with external doctor of ${FromOrg}`,
          NotificationAccept: "Accept and reply back to Admin",
          NotificationDeny: "Decline with a polite note",
          Data: JSON.stringify(req.body.data)
        });
      });
    })
    .then(() => {
      return CreateNotificationModelObject({
        To: `${FromOrg}#doctor#${FromDoc}`,
        From: `Hospital Admin#${req.user.org}#admin#${req.user.username}`,
        NotificationString: `The hospital admin has accepted your access request. Please wait while your request is fully processed`,
        NotificationAccept: "null",
        NotificationDeny: "null",
        Data: JSON.stringify(req.body.data)
      });
    })
    .then(() => {
      return CreateNotificationModelObject({
        To: `${req.user.org}#admin#${req.user.username}`,
        From: "null",
        NotificationString: `You have accepted the request of doctor from ${FromOrg} to share patient record information and broadcasted the request to associated doctors`,
        NotificationAccept: "null",
        NotificationDeny: "null",
        Data: JSON.stringify(req.body.data)
      });
    })
    .then(() => {
      return Notification.findByIdAndUpdate(notifObj._id, {
        Read: true,
        NotificationAccept: "null",
        NotificationDeny: "null"
      });
    })
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.log(err);
      return res.status(500).json("An unexpected error occured");
    });
});

router.post("/denyExternalDoctorRequest", authenticateUser, (req, res) => {
  const { FromDoc, FromOrg, PatientOrg } = req.body.data;
  const note = req.body.note;
  const notifObj = req.body.notifObj;
  RequestModel.findOneAndUpdate(
    { RID: `${FromOrg}#doctor#${FromDoc}` },
    {
      Status: "Not Active",
      CommentToAccessOrDeny:
        "Your request to access the external patient data was denied by the admin with a reason mentioned below",
      Note: note
    }
  )
    .exec()
    .then(() => {
      return CreateNotificationModelObject({
        To: `${FromOrg}#doctor#${FromDoc}`,
        From: `Hospital Admin#${req.user.org}#admin#${req.user.username}`,
        NotificationString: `The request has been denied by the hospital organization. Note from hospital : ${note}`,
        NotificationAccept: "null",
        NotificationDeny: "null",
        Data: JSON.stringify(req.body.data)
      });
    })
    .then(() => {
      return CreateNotificationModelObject({
        To: `${req.user.org}#admin#${req.user.username}`,
        From: "null",
        NotificationString: `You denied the external doctor's request to share your patient record for Patient from ${PatientOrg} with note -: ${note}`,
        NotificationAccept: "null",
        NotificationDeny: "null",
        Data: JSON.stringify(req.body.data)
      });
    })
    .then(() => {
      return Notification.findByIdAndUpdate(notifObj._id, {
        Read: true,
        NotificationAccept: "null",
        NotificationDeny: "null"
      });
    })
    .then(() => {
      return res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("An unexpected error occured");
    });
});
export default router;
