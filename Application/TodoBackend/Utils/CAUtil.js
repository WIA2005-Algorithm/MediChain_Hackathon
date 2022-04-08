"use strict";
import { Gateway } from "fabric-network";
import { intialize } from "../controllers/register.js";
import { log } from "../models/Utilities.model.js";
import {
    chaincodeName,
    channelName,
    green,
} from "../Utils/NetworkConstants.js";
import errors from "./Errors.js";
export const buildCAClient = (FabricCAServices, ccp, orgName) => {
    // Create a new CA client for interacting with the CA.
    const caInfo =
        ccp.certificateAuthorities[
            ccp.organizations[orgName].certificateAuthorities[0]
        ]; //lookup CA details from config
    console.log(caInfo);
    if (!caInfo)
        throw errors.file_not_found.withDetails(
            "Configuration Files are missing"
        );
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices(
        caInfo.url,
        { trustedRoots: caTLSCACerts, verify: false },
        caInfo.caName
    );
    console.log(`Built a CA Client named ${caInfo.caName}`);
    return caClient;
};

export const enrollAdmin = async (caClient, wallet, orgName, ccp) => {
    const user = ccp.organizations[orgName].adminUserId;
    const pass = ccp.organizations[orgName].adminUserPasswd;
    const orgMspId = ccp.organizations[orgName].mspid;
    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(user);
    if (identity) {
        log(
            "SuperAdmin",
            `Enrolling Admin  : [${orgName}]`,
            "Admin is enrolled into the network already",
            "removecircle"
        );
        throw errors.duplicate_identity.withDetails(
            "An identity for the admin user already exists in the wallet."
        );
    }
    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await caClient.enroll({
        enrollmentID: user,
        enrollmentSecret: pass,
    });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: orgMspId,
        type: "X.509",
    };
    await wallet.put(user, x509Identity);
    return user;
};

export const registerAndEnrollUser = async (
    caClient,
    wallet,
    orgName,
    userId,
    affiliation,
    ccp
) => {
    // Check to see if we've already enrolled the user
    const userIdentity = await wallet.get(userId);
    const admin = ccp.organizations[orgName].adminUserId;
    const orgMspId = ccp.organizations[orgName].mspid;
    if (userIdentity)
        throw errors.duplicate_identity.withDetails(
            "An identity for the requested user already exists in the wallet."
        );

    // Must use an admin to register a new user
    const adminIdentity = await wallet.get(admin);
    if (!adminIdentity)
        throw errors.required_admin.withDetails(
            "The organisation admin is missing in the wallet. Enroll admin before registering users."
        );

    // build a user object for authenticating with the CA
    const provider = wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, admin);

    // Register the user, enroll the user, and import the new identity into the wallet.
    // if affiliation is specified by client, the affiliation value must be configured in CA
    const secret = await caClient.register(
        {
            affiliation: `${orgName.toLowerCase()}.${affiliation}`,
            enrollmentID: userId,
            role: "client",
        },
        adminUser
    );
    const enrollment = await caClient.enroll({
        enrollmentID: userId,
        enrollmentSecret: secret,
    });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: orgMspId,
        type: "X.509",
    };
    await wallet.put(userId, x509Identity);
    console.log(
        `${green} Successfully registered and enrolled user ${userId} and imported it into the wallet`
    );
};

export async function getContract(orgName, userID) {
    const { wallet, ccp } = await intialize(orgName);
    try {
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: userID,
            discovery: { enabled: true, asLocalhost: true },
        });
        const contract = (await gateway.getNetwork(channelName)).getContract(
            chaincodeName
        );
        return { contract, gateway };
    } catch (e) {
        throw errors.not_reachable.withDetails("null");
    }
}
