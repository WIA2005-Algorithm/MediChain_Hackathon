"use-strict";
import { Router } from "express";
import errors, { response, ApiError } from "../Utils/Errors.js";
import {
  createNetwork,
  createOrganization
} from "../controllers/CreateNetwork.controller.js";
import { Block_Network, Organizations, Superuser } from "../models/Network.model.js";
import { generateNetworkFiles, StopNetwork } from "../Utils/execute.js";
import { authenticateUser, getAccessToken } from "../server_config.js";
import { EnrollAdmin } from "../controllers/register.js";
import { log } from "../models/Utilities.model.js";
import { createEntity } from "../controllers/Entity.controller.js";
import { HospitalEntity } from "../models/Entity.model.js";
const router = Router();
router.post("/create/network", authenticateUser, (req, res) => {
  createNetwork({
    Name: req.body.name,
    NetID: req.body.netID,
    Address: req.body.address
  })
    .then(() => res.status(200).json({ message: "Network was successfully created" }))
    .catch((err) => {
      if (!(err instanceof ApiError))
        err = new ApiError(
          409,
          "Bad Input",
          "There is an error in the input provided.."
        ).withDetails(err.message);
      log(
        "SuperAdmin",
        `Network Creation Failed for ID : [${req.body.name}]`,
        "There was an error in the input provided. You may resubmit form later - 409",
        "error"
      );
      res.status(err.status).json(new response.errorResponse(err));
    });
});
router.post("/create/organization", authenticateUser, (req, res) => {
  createEntity({
    userID: req.body.adminID,
    password: req.body.password,
    organization: req.body.id,
    type: "admin"
  })
    .then(() => Block_Network.findOne({ Name: req.body.networkName }).exec())
    .then((doc) => {
      const NetworkID = doc._id;
      return createOrganization(NetworkID, {
        FullName: req.body.fullName,
        Name: req.body.id,
        AdminID: req.body.adminID,
        Password: req.body.password,
        Country: req.body.country,
        State: req.body.state,
        Location: req.body.location
      });
    })
    .then(() =>
      res.status(200).json({ message: "Organization was successfully created" })
    )
    .catch((err) => {
      if (!(err instanceof ApiError))
        err = new ApiError(
          409,
          "Bad Input",
          "There is an error in the input provided.."
        ).withDetails(err.message);
      log(
        "SuperAdmin",
        `Organization Creation Failed For [${req.body.id}]`,
        "There was an error in the input provided. You may resubmit form later - 409",
        "error"
      );
      return res.status(err.status).json(new response.errorResponse(err));
    });
});

router.post("/network/start", authenticateUser, (req, res) => {
  Block_Network.findOne({ Name: req.body.networkName })
    .populate("Organizations")
    .exec(function (err, network) {
      if (!network) {
        err = errors.request_failed.withDetails("No more details available");
        res.status(err.status).json(new response.errorResponse(err));
      } else {
        if (network.Status.code == 200 || network.Status.code == 300)
          return res.status(200).json({
            Status: network.Status,
            message: network.Status.description
          });
        else if (network.Organizations.length === 0)
          return res.status(200).json({
            Status: network.Status,
            message: network.Status.description
          });
        let execution = `-netName "${network.Name}" -netID ${network.NetID} -netAdd ${network.Address} `;
        network.Organizations.forEach((hosp) => {
          execution += `-org ${hosp.Name} ${hosp.AdminID} ${hosp.Password} "${hosp.Country}" "${hosp.State}" "${hosp.Location}" ${hosp.P0PORT} ${hosp.CAPORT} ${hosp.COUCHPORT} `;
        });
        generateNetworkFiles(execution, network.Name);
        res.status(200).json({
          message: "Request to start network was successfull",
          Status: { code: 300, message: "Pending" }
        });
      }
    });
});

router.post("/network/stop", authenticateUser, (req, res) => {
  Block_Network.findOne({ Name: req.body.networkName }).exec(function (err, network) {
    if (!network) {
      err = errors.request_failed.withDetails("No more details available");
      res.status(err.status).json(new response.errorResponse(err));
    } else {
      if (network.Status.code == 0 || network.Status.code == 300)
        return res.status(200).json({
          Status: network.Status,
          message: network.Status.description
        });
      StopNetwork(req.body.networkName);
      res.status(200).json({
        message: "Request to stop the network was successfull",
        Status: { code: 300, message: "Pending" }
      });
    }
  });
});

router.get("/network/status", (_, res) => {
  Block_Network.findOne({}, "Status").exec(function (err, status) {
    if (!status || err)
      res.status(400).json({
        code: 300,
        message: "Pending",
        description: "Pending status"
      });
    return res.status(200).json(status.Status);
  });
});

router.get("/network/count", (_, res) => {
  Block_Network.countDocuments({}).exec(function (_, count) {
    if (count == undefined) return res.sendStatus(500);
    else return res.status(200).json({ count: count });
  });
});

router.get("/network/exists", authenticateUser, (req, res) => {
  Block_Network.findOne({ Name: req.query.networkName })
    .populate("Organizations")
    .exec(function (_, network) {
      return res
        .status(200)
        .json(network ? network : { exists: "Network Doesn't Exists" });
    });
});

router.post("/login", (req, res) => {
  Superuser.findOne({ username: req.body.username }, function (err, user) {
    if (!user) {
      err = errors.invalid_auth.withDetails("Username/Password is incorrect");
      return res.status(err.status).json(new response.errorResponse(err));
    }
    user.comparePassword(req.body.password, function (_, isMatch) {
      if (!isMatch) {
        const err = errors.invalid_auth.withDetails("Username/Password is incorrect");
        return res.status(err.status).json(new response.errorResponse(err));
      }
      const session = getAccessToken({
        username: user.username,
        role: "superadmin"
      });
      Superuser.findByIdAndUpdate(user._id, {
        refreshToken: session.refreshToken
      })
        .then(() => {
          log(
            "SuperAdmin",
            `User Login`,
            "Successfully Logged In [SuperAdmin]",
            "success"
          );
          return res.status(200).json(session);
        })
        .catch(() => res.status(500));
    });
  });
});

router.get("/network/all", authenticateUser, (_, res) => {
  Block_Network.findOne({}, function (_, network) {
    if (!network) {
      err = errors.request_failed.withDetails("null");
      return res.status(err.status).json(new response.errorResponse(err));
    }
    return res.status(200).json(network);
  });
});

router.delete("/organizations/:networkName/:org/:admin", authenticateUser, (req, res) => {
  Organizations.findByIdAndDelete(req.params.org, async () => {
    let userAdmin = await HospitalEntity.findOneAndDelete({
      userID: req.params.admin
    }).exec();
    if (!userAdmin) res.sendStatus(400);
    let del = await Block_Network.updateOne(
      { Name: req.params.networkName },
      {
        $pullAll: {
          Organizations: [{ _id: req.params.org }]
        }
      }
    ).exec();
    if (!del) res.sendStatus(400);
    log(
      "SuperAdmin",
      `Hospital Deleted Inside Network [${req.params.networkName}]`,
      "Successfully deleted the organization",
      "clear"
    );
    res.sendStatus(200);
  });
});

router.post("/organizations/:name/enroll", authenticateUser, (req, res) => {
  EnrollAdmin(req.params.name)
    .then(() =>
      Organizations.findOneAndUpdate({ Name: req.params.name }, { Enrolled: 1 }).exec()
    )
    .then(() => res.sendStatus(200))
    .catch((err) => {
      if (!(err instanceof ApiError))
        err = new ApiError(400, "Bad Request", err.message).withDetails(
          "Make sure the input is correct"
        );
      res.status(err.status).json(new response.errorResponse(err));
    });
});
export default router;
