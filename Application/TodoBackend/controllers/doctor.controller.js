import { getContract } from "../Utils/CAUtil.js";
import errors from "../Utils/Errors.js";
export async function getDotorDetails(orgName, issuerID) {
  const { contract, gateway } = await getContract(orgName, issuerID);
  try {
    const results = await contract.evaluateTransaction("getDotorBasicDetails", issuerID);
    return JSON.parse(Buffer.from(results, "base64").toString("ascii"));
  } catch (e) {
    throw errors.contract_error.withDetails(
      e.toString().includes("No valid responses from any peers")
        ? e.toString().split("Error:")[2]
        : "An unexpected error has occured while transacting your request. Please try again"
    );
  } finally {
    gateway.disconnect();
  }
}

export async function getPatientDetails(orgName, issuerID, ID) {
  const { contract, gateway } = await getContract(orgName, issuerID);
  try {
    const results = await contract.evaluateTransaction("getPatientBasicDetails", ID);
    return JSON.parse(Buffer.from(results, "base64").toString("ascii"));
  } catch (e) {
    throw errors.contract_error.withDetails(
      e.toString().includes("No valid responses from any peers")
        ? e.toString().split("Error:")[2]
        : "An unexpected error has occured while transacting your request. Please try again"
    );
  } finally {
    gateway.disconnect();
  }
}

export async function dischargePatientForDoctor(orgName, issuerID, PTID, note) {
  const { contract, gateway } = await getContract(orgName, issuerID);
  try {
    await contract.submitTransaction("dischargePatientForDoctor", issuerID, PTID, note);
  } catch (e) {
    console.log(e);
    throw errors.contract_error.withDetails(
      e.toString().includes("No valid responses from any peers")
        ? e.toString().split("Error:")[2]
        : "An unexpected error has occured while transacting your request. Please try again"
    );
  } finally {
    gateway.disconnect();
  }
}
