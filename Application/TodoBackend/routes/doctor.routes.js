import { Router } from "express";
import {
  acceptRequestToFromAdmin,
  checkIfPatientExists,
  dischargePatientForDoctor,
  getDataForExternal,
  getDotorDetails,
  getPatientDetails
} from "../controllers/doctor.controller.js";
import {
  CreateNotificationModelObject,
  CreateRequestModelObject
} from "../controllers/RequestData.controller.js";
import { Organizations } from "../models/Network.model.js";
import { Notification, RequestModel } from "../models/NotificationModel.js";
import { authenticateUser } from "../server_config.js";
import { ApiError, response } from "../Utils/Errors.js";
const router = Router();

router.get("/getDoctor", authenticateUser, (req, res) => {
  getDotorDetails(req.user.org, req.user.username)
    .then((data) => {
      console.log(data);
      res.status(200).json(data);
    })
    .catch((err) => {
      if (!(err instanceof ApiError))
        err = new ApiError(
          401,
          "Validity Error",
          "There is an unexpected error in the contract.."
        ).withDetails(err.message);
      return res.status(err.status).json(response.errorResponse(err));
    });
});

router.get("/getPatient", authenticateUser, (req, res) => {
  getPatientDetails(req.user.org, req.user.username, req.query.ptID)
    .then((data) => {
      console.log(data);
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

router.post("/dischargePTForDoctor", authenticateUser, (req, res) => {
  dischargePatientForDoctor(req.user.org, req.user.username, req.body.PTID, req.body.NOTE)
    .then(() => res.sendStatus(200))
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

router.post("/requestExternalPatient", authenticateUser, (req, res) => {
  // Doc who is requesting
  const docName = req.body.docName;
  const docOrg = req.user.org;
  const docID = req.user.username;
  // Patient who's data is being requested
  const PTID = req.body.PTID;
  const PTORG = req.body.PTORG;
  const Data = {
    PatientID: PTID,
    PatientOrg: PTORG,
    FromDoc: docID,
    FromOrg: docOrg,
    FromName: docName
  };
  if (docOrg === PTORG) {
    err = new ApiError(
      401,
      "Validity Error",
      "There is an unexpected error in the contract.."
    ).withDetails(
      "Please note that patient from the same organization can be requested simply by contacting the admin of hospital"
    );
    return res.status(err.status).json(new response.errorResponse(err));
  }
  checkIfPatientExists(req.user.org, req.user.username, PTID, PTORG)
    .then(() => {
      return RequestModel.findOne({ RID: `${docOrg}#doctor#${docID}` }).exec();
    })
    .then(async (R) => {
      if (R && R.Status === "Active") {
        err = new ApiError(
          401,
          "Validity Error",
          "There is an unexpected error in the contract.."
        ).withDetails(
          "Please note your previous request is still in processing, you cannot start new until previous is completed. Please check the requests panel for more"
        );
        return res.status(err.status).json(new response.errorResponse(err));
      } else {
        if (R) await RequestModel.deleteOne({ RID: `${docOrg}#doctor#${docID}` });
        CreateRequestModelObject({
          RID: `${docOrg}#doctor#${docID}`,
          Status: "Active",
          CommentToAccessOrDeny: `The request to get access to external patient record is pending. Details:- Hospital: ${PTORG}, Patient: ${PTID}`,
          Data: null
        })
          .then(() => {
            return Organizations.findOne({ Name: PTORG }).exec();
          })
          .then((org) => {
            return CreateNotificationModelObject({
              To: `${PTORG}#admin#${org.AdminID}`,
              From: `${docName}#${docOrg}#doctor#${docID}`,
              NotificationString: `${docOrg} Doctor with ID: ${docID} and Name: ${docName} has requested to access the data of patient with ID: ${PTID}.`,
              NotificationAccept: "Accept and Forward to all the associated doctors",
              NotificationDeny: "Decline with a polite note",
              Data: JSON.stringify(Data)
            });
          })
          .then(() => {
            return CreateNotificationModelObject({
              To: `${docOrg}#doctor#${docID}`,
              From: "null",
              NotificationString:
                "The request for extenal patient data was successful. Please wait while the corresponding hospital accepts your request",
              NotificationAccept: "null",
              NotificationDeny: "null",
              Data: JSON.stringify(Data)
            });
          })
          .then(() => {
            return res
              .status(200)
              .json(
                "The request was sent to the hospital admin successfully. Please wait while they accept it. An accepted request will contain the appropriate records and a declined request will contain a polite note by their side."
              );
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
      }
    })
    .catch((err) => {
      if (!(err instanceof ApiError)) {
        err = new ApiError(
          401,
          "Validity Error",
          "There is an unexpected error in the contract.."
        ).withDetails(err.message);
      }
      return res.status(err.status).json(new response.errorResponse(err));
    });
});

router.post("/acceptRequestToFromAdmin", authenticateUser, (req, res) => {
  const { FromDoc, FromOrg, PatientID, PatientOrg } = req.body.data;
  const doctor = req.body.doctor;
  const notifObj = req.body.notifObj;
  const UID = String(JSON.parse(notifObj.Data).UID);
  acceptRequestToFromAdmin(
    req.user.org,
    req.user.username,
    PatientID,
    Buffer.from(UID, "utf8"),
    FromDoc
  )
    .then(() => {
      return RequestModel.findOne({ RID: `${FromOrg}#doctor#${FromDoc}` }).exec();
    })
    .then((R) => {
      let requestedD = JSON.parse(R.EMRAccepted);
      requestedD.push(JSON.stringify(doctor));
      return RequestModel.updateOne(
        { RID: R.RID },
        { EMRAccepted: JSON.stringify(requestedD) }
      );
    })
    .then(() => {
      return RequestModel.findOne({ RID: `${FromOrg}#doctor#${FromDoc}` });
    })
    .then(async (R) => {
      if (JSON.parse(R.EMRAccepted).length === JSON.parse(R.EMRRequested).length)
        await CreateNotificationModelObject({
          To: `${PatientOrg}#patient#${PatientID}`,
          From: `Hospital Admin#${req.user.org}#admin#${req.user.username}`,
          NotificationString: `An external doctor wants to access your patient record. A number of EMR records associated will be shared`,
          NotificationAccept: "Accept",
          NotificationDeny: "Deny",
          Data: JSON.stringify(req.body.data)
        });
      await CreateNotificationModelObject({
        To: `${req.user.org}#doctor#${req.user.username}`,
        From: "null",
        NotificationString: `The request to share the patient record of patient : ${PatientID} was accepted by you`,
        NotificationAccept: "null",
        NotificationDeny: "null"
      });
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

router.post("/denyRequestToFromAdmin", authenticateUser, (req, res) => {
  const { PatientOrg, FromDoc, FromOrg, PatientID } = req.body.data;
  const note = req.body.note;
  const others = req.body.others;
  const notifObj = req.body.notifObj;
  let WholeDeniedORAccepted = false;
  let PatientToOrg = null;
  Organizations.findOne({ Name: PatientOrg })
    .exec()
    .then((org) => {
      PatientToOrg = org;
      return CreateNotificationModelObject({
        To: `${PatientOrg}#admin#${PatientToOrg.AdminID}`,
        From: `${others.name}#${req.user.org}#doctor#${req.user.username}`,
        NotificationString: `The request has been denied by the doctor : ${req.user.username}. Note from the doctor :- ${note}`,
        NotificationAccept: "null",
        NotificationDeny: "null"
      });
    })
    .then(() => {
      return CreateNotificationModelObject({
        To: `${req.user.org}#doctor#${req.user.username}`,
        From: "null",
        NotificationString: `The request to share the patient record to hospital ${FromOrg} was denied by you with a note :- ${note}`,
        NotificationAccept: "null",
        NotificationDeny: "null"
      });
    })
    .then(() => {
      return RequestModel.findOne({ RID: `${FromOrg}#doctor#${FromDoc}` }).exec();
    })
    // PROBLEM HERE>>> PLEASE CHECK
    .then((R) => {
      const requestedD = JSON.parse(R.EMRRequested);
      const index = requestedD.indexOf(JSON.stringify(others));
      if (index > -1) requestedD.splice(index, 1);
      if (requestedD.length === 0) WholeDeniedORAccepted = true;
      return RequestModel.updateOne(
        { RID: R.RID },
        WholeDeniedORAccepted
          ? {
              Status: "Not Active",
              CommentToAccessOrDeny:
                "Your request to get access to external patient record was declined by all the doctors associated to the patient",
              Note: note,
              EMRRequested: JSON.stringify(requestedD)
            }
          : { EMRRequested: JSON.stringify(requestedD) }
      );
    })
    .then(async () => {
      if (WholeDeniedORAccepted) {
        await CreateNotificationModelObject({
          To: `${PatientOrg}#admin#${PatientToOrg.AdminID}`,
          From: "null",
          NotificationString: `The request to share the patient record to hospital ${FromOrg} was automatically denied as a whole because all the doctors associated to the patient have refused to share the record`,
          NotificationAccept: "null",
          NotificationDeny: "null"
        });
        await CreateNotificationModelObject({
          To: `${FromOrg}#admin#${FromOrg}`,
          From: "null",
          NotificationString: `The request to access the patient record from hospital ${PatientOrg} was automatically denied as a whole because all the doctors associated to the patient have refused to share the record`,
          NotificationAccept: "null",
          NotificationDeny: "null"
        });
      }
      return Notification.findByIdAndUpdate(notifObj._id, {
        Read: true,
        NotificationAccept: "null",
        NotificationDeny: "null"
      });
    })
    .then(async () => {
      const R = await RequestModel.findOne({
        RID: `${FromOrg}#doctor#${FromDoc}`
      }).exec();
      if (JSON.parse(R.EMRAccepted).length === JSON.parse(R.EMRRequested).length)
        await CreateNotificationModelObject({
          To: `${PatientOrg}#patient#${PatientID}`,
          From: `Hospital Admin#${req.user.org}#admin#${req.user.username}`,
          NotificationString: `An external doctor wants to access your patient record. A number of EMR records associated will be shared`,
          NotificationAccept: "Accept",
          NotificationDeny: "Deny",
          Data: JSON.stringify(req.body.data)
        });
      return res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("An unexpected error occured");
    });
});

router.post("/getDataForExternal", authenticateUser, (req, res) => {
  const { PatientID, PatientOrg, UID } = req.body.data;
  console.log("RECIEVED : ", PatientID, PatientOrg, UID);
  getDataForExternal(req.user.org, req.user.username, PatientID, UID)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});
export default router;
