'use-strict';
import { buildCCPOrg, buildWallet } from '../Utils/AppUtil.js';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from '../Utils/CAUtil.js';
import { green, walletPath} from "../Utils/NetworkConstants.js";
import { Wallets } from 'fabric-network';
import FabricCAServices from "fabric-ca-client";

const intialize = async (orgName) => { 
    const ccp = buildCCPOrg(orgName); 
    const caClient = buildCAClient(FabricCAServices, ccp, orgName);
    const wallet = await buildWallet(Wallets, walletPath);
    return {caClient, wallet, ccp}
}

export async function EnrollAdmin(orgName) {
    const {caClient, wallet, ccp} = await intialize(orgName);
    const UserId = await enrollAdmin(caClient, wallet, orgName, ccp);
    console.log(`${green} Successfully enrolled admin ${UserId}`);
}

export async function RegisterUser(orgName, userId, affiliation) {
    const {caClient, wallet, ccp} = await intialize(orgName);
    await registerAndEnrollUser(caClient, wallet, orgName, userId, affiliation, ccp);
    console.log(`${green} Successfully registered user ${userId}`);
}