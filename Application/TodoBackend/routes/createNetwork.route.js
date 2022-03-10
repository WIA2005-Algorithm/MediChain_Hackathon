import { Router } from 'express';
import errors, { response, ApiError } from "../Utils/Errors.js";
import { createNetwork, createOrganization } from '../controllers/CreateNetwork.controller.js';
import { Block_Network } from '../models/Network.model.js';
const router = Router();

router.post('/superuser/create/network', (req, res) => {
    createNetwork({
        Name: req.body.name,
        NetID: req.body.netID,
        Address: req.body.address
    }).then(()=> res.status(200).json({message: "Network was successfully created"}))
    .catch((err) => {
        if(!(err instanceof ApiError))
        err = new ApiError(409, 'Bad Input', 'There is an error in the input provided..').withDetails(err.message);
        res.status(err.status).json(new response.errorResponse(err));
    });
});

router.post('/superuser/create/organization', (req, res) => {
    Block_Network.findOne({ Name: "UMMC" }).lean().exec(function(err, doc){
        if(!doc){
            console.log(doc);
            err = errors.network_not_found.withDetails("Did you create the blockchain network yet?");
            res.status(err.status).json(new response.errorResponse(err));
        }
        else{
            const NetworkID = doc._id;
            console.log(NetworkID);
            createOrganization(NetworkID, {
                Name: req.body.name,
                AdminID: req.body.adminID,
                Password: req.body.password,
                Country: req.body.country,
                State: req.body.state,
                Location: req.body.location
            }).then(()=> res.status(200).json({message: "Organization was successfully created"}))
            .catch((err) => {
                if(!(err instanceof ApiError))
                err = new ApiError(409, 'Bad Input', 'There is an error in the input provided..').withDetails(err.message);
                res.status(err.status).json(new response.errorResponse(err));
            });
        }
    });
});

export default router


