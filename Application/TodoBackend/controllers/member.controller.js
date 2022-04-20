import { getContract } from "../Utils/CAUtil.js";
import errors from "../Utils/Errors.js";

export async function addMember(orgName, userID) {
    const { contract, gateway } = await getContract(orgName, userID);
    try {
        const result = await contract.submitTransaction(
            "addPatientEHR",
            userID,
            JSON.stringify({
                firstName: "Kamal",
                lastName: "Kumar Khatri",
                gender: "Male",
                DOB: "06/23/2001",
                street: null,
                zip: null,
                city: "Salalah",
                state: null,
                country: "Oman",
            }),
            JSON.stringify({
                mobile: "+96894637602",
                other: null,
                whatsapp: null,
            })
        );
        console.log(result.toString());
        gateway.disconnect();
    } catch (e) {
        throw errors.contract_error.withDetails(e.toString());
    }
}

export async function retriveAllPatients(orgName, userID) {
    const { contract, gateway } = await getContract(orgName, userID);
    try {
        const result = await contract.evaluateTransaction(
            "getPatientDetails",
            userID
        );
        console.log(result.toString());
        gateway.disconnect();
        return JSON.parse(result.toString());
    } catch (e) {
        throw errors.contract_error.withDetails(e.toString());
    }
}

export async function assign(orgName, did, pid) {
    const { contract, gateway } = await getContract(orgName, did);
    try {
        await contract.submitTransaction("assignPatientToDoctor", pid, did);
        gateway.disconnect();
    } catch (e) {
        throw errors.contract_error.withDetails(e.toString());
    }
}

export async function checkIn(orgName, pid) {
    const { contract, gateway } = await getContract(orgName, pid);
    try {
        await contract.submitTransaction("checkInPatient", pid);
        gateway.disconnect();
    } catch (e) {
        throw errors.contract_error.withDetails(e.toString());
    }
}
