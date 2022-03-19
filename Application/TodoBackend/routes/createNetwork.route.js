'use-strict';
import { query, Router } from 'express';
import errors, { response, ApiError } from "../Utils/Errors.js";
import { createNetwork, createOrganization } from '../controllers/CreateNetwork.controller.js';
import { Block_Network, Organizations, Superuser } from '../models/Network.model.js';
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
            err = errors.network_not_found.withDetails("Server couldn't recognize the blockchain network");
            res.status(err.status).json(new response.errorResponse(err));
        }
        else{
            const NetworkID = doc._id;
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
            return res.status(200).json({Status: network.Status, message: network.Status.description});
            else if((network.Organizations).length === 0)
            return res.status(200).json({Status: network.Status, message: network.Status.description});
            let execution = `-netName "${network.Name}" -netID ${network.NetID} -netAdd ${network.Address} `;
            (network.Organizations).forEach(hosp => {
                execution+=`-org ${hosp.Name} ${hosp.AdminID} ${hosp.Password} "${hosp.Country}" "${hosp.State}" "${hosp.Location}" ${hosp.P0PORT} ${hosp.CAPORT} ${hosp.COUCHPORT} `;
            });
            generateNetworkFiles(execution, network.Name);
            res.status(200).json({message: "Request to start network was successfull", Status: {code: 300, message: "Pending"}});  
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
            return res.status(200).json({Status: network.Status, message: network.Status.description});
            StopNetwork(req.body.networkName);
            res.status(200).json({message: "Request to stop the network was successfull", Status: {code: 300, message: "Pending"}});  
        }
    })
})

router.get('/network/status', (req, res) => {
    Block_Network.findOne({}, 'Status').exec(function(_, status){
        if(!status)
        res.status(400).json({code: 300, message: "Pending", description: "Pending status"})
        return res.status(200).json(status.Status);
    })
})

router.get('/network/count', (_, res) => {
    Block_Network.countDocuments({}).exec(function(_, count){
        console.log(count);
        if(count==undefined)
        return res.sendStatus(500);
        else
        return res.status(200).json({count: count});
    })
})

router.get('/network/exists', (req, res) => {
    Block_Network.findOne({Name: req.query.networkName}).populate("Organizations").exec(function(_, network){
        return res.status(200).json(network? network: {exists: "Network Doesn't Exists"});
    })
})

router.post('/login', (req, res) => {
    Superuser.findOne({ username: req.body.username }, function(err, user) {
        if (!user){
            err = errors.invalid_auth.withDetails("Username/Password is incorrect");
            return res.status(err.status).json(new response.errorResponse(err));
        }
        user.comparePassword(req.body.password, function(_, isMatch) {
            if (!isMatch){
                const err = errors.invalid_auth.withDetails("Username/Password is incorrect");
                return res.status(err.status).json(new response.errorResponse(err));
            }
            return res.status(200).json({message: "Authentication was successfull"});
        });
    });
})

router.get('/network/all', (_, res)=> {
    Block_Network.findOne({}, function(_, network){
        if(!network){
            err = errors.request_failed.withDetails("No more details available");
            return res.status(err.status).json(new response.errorResponse(err));
        }
        return res.status(200).json(network);
    })
})

router.delete('/organizations/:networkName/:org', (req, res) => {
    Organizations.findByIdAndDelete(req.params.org, async () => {
        let del = await Block_Network.updateOne({Name: req.params.networkName}, {
                $pullAll: {
                    Organizations: [{_id: req.params.org}]
                }
        }).exec();
        if(!del)
        res.sendStatus(400);
        res.sendStatus(200);
    });
})
export default router


