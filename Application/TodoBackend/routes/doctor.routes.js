import { Router } from "express";
import {
  dischargePatientForDoctor,
  getDotorDetails,
  getPatientDetails
} from "../controllers/doctor.controller.js";
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

// TODO
router.post("/uploadPatientFile", authenticateUser, (req, res) => {});
export default router;
