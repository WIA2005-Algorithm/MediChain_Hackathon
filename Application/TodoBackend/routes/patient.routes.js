import errors, { ApiError, response } from "../Utils/Errors.js";
import { Router } from "express";
import { getPatientDetails } from "../controllers/doctor.controller.js";
import { authenticateUser } from "../server_config.js";
import { acceptRequestToFromDoctors } from "../controllers/patient.controller.js";
import { Notification, RequestModel } from "../models/NotificationModel.js";
import { CreateNotificationModelObject } from "../controllers/RequestData.controller.js";
import { Organizations } from "../models/Network.model.js";
const router = Router();

router.get("/getPatient", authenticateUser, (req, res) => {
  console.log(" HERE 1", req.user.username);
  getPatientDetails(req.user.org, req.user.username, req.user.username)
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
      return res.status(err.status).json(new response.errorResponse(err));
    });
});

router.post("/acceptRequestToFromDoctors", authenticateUser, (req, res) => {
  const { FromDoc, FromOrg, PatientID, PatientOrg } = req.body.data;
  const notifObj = req.body.notifObj;
  const UID = String(JSON.parse(notifObj.Data).UID);
  const name = req.body.name;
  acceptRequestToFromDoctors(
    req.user.org,
    req.user.username,
    Buffer.from(UID, "utf8"),
    FromDoc
  )
    .then(() => {
      return Organizations.findOne({ Name: PatientOrg }).exec();
    })
    .then((org) => {
      return CreateNotificationModelObject({
        To: `${PatientOrg}#admin#${org.AdminID}`,
        From: `${name}#${req.user.org}#patient#${req.user.username}`,
        NotificationString: `The request to the patient record of ${PatientID} was accepted by the patient themselves. This was the last stage of acceptance, thus an automatic access will be delivered to the doctor.`,
        NotificationAccept: "null",
        NotificationDeny: "null"
      });
    })
    .then(() => {
      return CreateNotificationModelObject({
        To: `${req.user.org}#patient#${req.user.username}`,
        From: "null",
        NotificationString: `You accepted the request to share your record with the external doctor of hospital ${FromOrg}. This was the last stage of acceptance, thus an automatic access will be delivered to the doctor.`,
        NotificationAccept: "null",
        NotificationDeny: "null"
      });
    })
    .then(() => {
      return CreateNotificationModelObject({
        To: `${FromOrg}#doctor#${FromDoc}`,
        From: `Hospital Admin#${req.user.org}#admin#${req.user.username}`,
        NotificationString: `The hospital doctor is able to access the patient record of ${PatientID} from hospital ${req.user.org}. Please click on the request access the record`,
        NotificationAccept: "null",
        NotificationDeny: "null",
        Data: JSON.stringify(req.body.data)
      });
    })
    .then(() => {
      return RequestModel.findOne({ RID: `${FromOrg}#doctor#${FromDoc}` });
    })
    .then(async (R) => {
      console.log("LOLOLOLOLOLOLOL");
      return RequestModel.findOneAndUpdate(
        { RID: R.RID },
        {
          Status: "Accepted",
          CommentToAccessOrDeny:
            "All the stages of requests have been fulfilled and approved by external hospital. Please click the link to open the record",
          Note: "Open the record to access"
        }
      );
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
router.post("/denyRequestToFromDoctors", authenticateUser, (req, res) => {
  const { PatientOrg, FromDoc, FromOrg } = req.body.data;
  const name = req.body.name;
  const note = req.body.note;
  const notifObj = req.body.notifObj;
  let PatientToOrg = null;
  Organizations.findOne({ Name: PatientOrg })
    .exec()
    .then((org) => {
      PatientToOrg = org;
      return CreateNotificationModelObject({
        To: `${PatientOrg}#admin#${PatientToOrg.AdminID}`,
        From: `${name}#${req.user.org}#patient#${req.user.username}`,
        NotificationString: `The request has been denied by the patient to access their record : ${req.user.username}. Note from the patient :- ${note}`,
        NotificationAccept: "null",
        NotificationDeny: "null"
      });
    })
    .then(() => {
      return CreateNotificationModelObject({
        To: `${req.user.org}#patient#${req.user.username}`,
        From: "null",
        NotificationString: `The request to share your record to external doctor of hospital ${FromOrg} was denied by you with a note :- ${note}`,
        NotificationAccept: "null",
        NotificationDeny: "null"
      });
    })
    .then(() => {
      return CreateNotificationModelObject({
        To: `${FromOrg}#doctor#${FromDoc}`,
        From: `Hospital Admin#${req.user.org}#admin#${req.user.username}`,
        NotificationString: `The hospital admin has denied your request as the patient has denied the request to share their record with a note :- ${note}`,
        NotificationAccept: "null",
        NotificationDeny: "null",
        Data: JSON.stringify(req.body.data)
      });
    })
    .then(() => {
      return RequestModel.updateOne(
        { RID: `${FromOrg}#doctor#${FromDoc}` },
        {
          Status: "Not Active",
          CommentToAccessOrDeny:
            "Your request to access the external patient data was denied by the patient themselves. Note this was the last stage of request acceptance",
          Note: note,
          EMRRequested: "null",
          Data: null
        }
      );
    })
    .then(async () => {
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
