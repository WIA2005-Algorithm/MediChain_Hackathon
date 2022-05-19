"use-strict";
import { buildCCPOrg, buildWallet } from "../Utils/AppUtil.js";
import {
    buildCAClient,
    enrollAdmin,
    registerAndEnrollUser,
} from "../Utils/CAUtil.js";
import { green, walletPath } from "../Utils/NetworkConstants.js";
import { Wallets } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import { log } from "../models/Utilities.model.js";
/**
 * ccp: retrives connection profile stored inside individual organizations
 * caClinet: Build Instance of CA Profile based on ccp
 * @param {String} orgName - Example: UMMC
 * @returns {JSON_OBJECT - caClient, wallet, ccp}
 */
export const intialize = async (orgName) => {
    const ccp = buildCCPOrg(orgName);
    const caClient = buildCAClient(FabricCAServices, ccp, orgName);
    const wallet = await buildWallet(Wallets, walletPath(orgName));
    return { caClient, wallet, ccp };
};

/**
 *
 * @param {String} orgName - Example: UMMC
 */
export async function EnrollAdmin(orgName) {
    const { caClient, wallet, ccp } = await intialize(orgName);
    const UserId = await enrollAdmin(caClient, wallet, orgName, ccp);
    log(
        "SuperAdmin",
        `Enrolling Admin  : [${orgName}]`,
        "Admin was successfully enrolled into the network",
        "success"
    );
    console.log(`${green} Successfully enrolled admin ${UserId}`);
}

/**
 *
 * @param {String} orgName - Example: UMMC
 * @param {String} userId - Username
 * @param {String} affiliation - "doctor" or "patient"
 */
export async function RegisterUser(orgName, userId, affiliation) {
    const { caClient, wallet, ccp } = await intialize(orgName);
    console.log(affiliation, "IN REGISTERuser");
    await registerAndEnrollUser(
        caClient,
        wallet,
        orgName,
        userId,
        affiliation,
        ccp
    );
    console.log(`${green} Successfully registered user ${userId}`);
}
