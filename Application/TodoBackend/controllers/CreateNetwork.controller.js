'use-strict';
import { Block_Network, Organizations } from "../models/Network.model.js";

export const createNetwork = async (network) => {
    const NETWORK= await Block_Network.create(network);
    console.log("\n>> Created Network Successfully:\n", NETWORK);
    return NETWORK;
  };

  // One to many relationship [network to organization]
  // Adding organization created inside network by updating network field "Organizations" array
export const createOrganization = async function(NetworkID, Org) {
    const docOrg = await Organizations.create(Org);
    console.log("\n>> Added Hospital Successfully:\n", docOrg);
    return await Block_Network.findByIdAndUpdate(
        NetworkID,
        { $push: { Organizations: docOrg._id } },
        { new: true, useFindAndModify: false }
    );
};

export const setNetworkStatus = async function (NetworkName, status) {
    return await Block_Network.findOneAndUpdate({Name: NetworkName}, {Status: status});
}

export const getNetworkStatus = async function (NetworkName){
    return await Block_Network.findOne({Name: NetworkName});
}