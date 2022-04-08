"use-strict";
import { Router } from "express";
import { response, ApiError } from "../Utils/Errors.js";
import { EnrollAdmin, RegisterUser } from "../controllers/register.js";
import { addMember } from "../controllers/member.controller.js";
const router = Router();

router.post("/admin/enroll", (req, res) => {
    const org = req.body.organisation;
    EnrollAdmin(org)
        .then(() =>
            res.status(200).json({ message: "Enrollment was successfull" })
        )
        .catch((err) => {
            if (!(err instanceof ApiError))
                err = new ApiError(400, "Bad Request", err.message).withDetails(
                    "Make sure the input is correct"
                );
            res.status(err.status).json(new response.errorResponse(err));
        });
});
router.post("/client/new", (req, res) => {
    const org = req.body.organisation;
    const userid = req.body.user;
    const affiliation = req.body.affiliation;
    RegisterUser(org, userid, affiliation)
        .then(() => addMember(org, userid))
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
