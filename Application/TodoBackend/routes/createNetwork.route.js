import { Router } from 'express';
import errors, { response, ApiError } from "../Utils/Errors.js";
import { createNetwork, createOrganization } from '../controllers/CreateNetwork.controller.js';
import { Block_Network } from '../models/Network.model.js';
import { CreateNetwork, StartNetwork, StopNetwork } from "../Utils/execute.js";
const router = Router();

router.post('/create/network', (req, res) => {
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

router.post('/create/organization', (req, res) => {
    Block_Network.findOne({ Name: req.body.networkName }).exec(function(err, doc){
        if(!doc){
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

router.post('/run/network', (req, res) => {
    Block_Network.findOne({Name: req.body.networkName}).populate("Organizations").exec(function(err, network) {
        if(!network){
            err = errors.request_failed.withDetails("No more details available");
            res.status(err.status).json(new response.errorResponse(err));
        }
        else{
            let execution = `-netName "${network.Name}" -netID ${network.NetID} -netAdd ${network.Address} `;
            console.log(execution);
            (network.Organizations).forEach(hosp => {
                execution+=`-org ${hosp.Name} ${hosp.AdminID} ${hosp.Password} "${hosp.Country}" "${hosp.State}" "${hosp.Location}" ${hosp.P0PORT} ${hosp.CAPORT} ${hosp.COUCHPORT} `
            });;
            try {
                createNetwork(execution).then(()=>{
                    console.log("here");
                    // StartNetwork();
                });
                res.sendStatus(200);
            } catch (error) {
             res.status(400).json({message: error.message});   
            }
            // createOrganization(NetworkID, {
            //     Name: req.body.name,
            //     AdminID: req.body.adminID,
            //     Password: req.body.password,
            //     Country: req.body.country,
            //     State: req.body.state,
            //     Location: req.body.location
            // }).then(()=> res.status(200).json({message: "Organization was successfully created"}))
            // .catch((err) => {
            //     if(!(err instanceof ApiError))
            //     err = new ApiError(409, 'Bad Input', 'There is an error in the input provided..').withDetails(err.message);
            //     res.status(err.status).json(new response.errorResponse(err));
            // });
        }
    })
})
export default router


