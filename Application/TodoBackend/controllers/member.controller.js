import { getContract } from "../Utils/CAUtil.js";
import errors from "../Utils/Errors.js";


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
