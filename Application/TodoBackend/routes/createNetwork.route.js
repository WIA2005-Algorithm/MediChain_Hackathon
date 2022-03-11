'use-strict';
import { query, Router } from 'express';
import errors, { response, ApiError } from "../Utils/Errors.js";
import { createNetwork, createOrganization, getNetworkStatus } from '../controllers/CreateNetwork.controller.js';
import { Block_Network } from '../models/Network.model.js';
import { generateNetworkFiles, StopNetwork } from "../Utils/execute.js";
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
                FullName: req.body.fullName,
                Name: req.body.id,
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

router.post('/network/start', (req, res) => {
    Block_Network.findOne({Name: req.body.networkName}).populate("Organizations").exec(function(err, network) {
        if(!network){
            err = errors.request_failed.withDetails("No more details available");
            res.status(err.status).json(new response.errorResponse(err));
        }
        else{
            if(network.Status.code == 200 || network.Status.code == 300)
            return res.status(200).json({status: network.Status.message, message: network.Status.description});
            let execution = `-netName "${network.Name}" -netID ${network.NetID} -netAdd ${network.Address} `;
            (network.Organizations).forEach(hosp => {
                execution+=`-org ${hosp.Name} ${hosp.AdminID} ${hosp.Password} "${hosp.Country}" "${hosp.State}" "${hosp.Location}" ${hosp.P0PORT} ${hosp.CAPORT} ${hosp.COUCHPORT} `;
            });
            generateNetworkFiles(execution, network.Name);
            res.status(200).json({message: "Request to start network was successfull"});  
        }
    })
})
router.post('/network/stop', (req, res) => {
    Block_Network.findOne({Name: req.body.networkName}).exec(function(err, network) {
        if(!network){
            err = errors.request_failed.withDetails("No more details available");
            res.status(err.status).json(new response.errorResponse(err));
        }
        else{
            if(network.Status.code == 0 || network.Status.code == 300)
            return res.status(200).json({status: network.Status.message, message: network.Status.description});
            StopNetwork(req.body.networkName);
            res.status(200).json({message: "Request to stop the network was successfull"});  
        }
    })
})

router.get('/network/status', (req, res) => {
    console.log(req.query);
    Block_Network.findOne({Name: req.query.networkName}, 'Status').exec(function(_, status){
        if(!status)
        res.status(400).json({code: 300, message: "pending", description: "Pending status"})
        return res.status(200).json(status.Status);
    })
    req.params.networkName
})
export default router


