"use-strict";
import { Block_Network, Organizations } from "../models/Network.model.js";
import { log } from "../models/Utilities.model.js";

export const createNetwork = async (network) => {
    const NETWORK = await Block_Network.create(network);
    console.log("\n>> Created Network Successfully:\n", NETWORK);
    log(
        "SuperAdmin",
        "Network Creation",
        `A new network was successfully created [${network.Name}]`,
        "add"
    );
    return NETWORK;
};

// One to many relationship [network to organization]
// Adding organization created inside network by updating network field "Organizations" array
export const createOrganization = async function (NetworkID, Org) {
    const docOrg = await Organizations.create(Org);
    console.log("\n>> Added Hospital Successfully:\n", docOrg);
    log(
        "SuperAdmin",
        "Hospital Created",
        `You created a new hospital : [${Org.Name}] with admin : [${Org.AdminID}]`,
        "add"
    );
    return await Block_Network.findByIdAndUpdate(
        NetworkID,
        { $push: { Organizations: docOrg._id } },
        { new: true, useFindAndModify: false }
    );
};

export const setNetworkStatus = async function (NetworkName, status) {
    return await Block_Network.findOneAndUpdate(
        { Name: NetworkName },
        { Status: status }
    );
};
