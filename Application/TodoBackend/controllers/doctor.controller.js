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

export async function acceptRequestToFromAdmin(orgName, issuerID, PTID, UID, FromDoc) {
  const { contract, gateway } = await getContract(orgName, issuerID);
  try {
    await contract.submitTransaction(
      "acceptRequestToFromAdmin",
      issuerID,
      PTID,
      UID,
      FromDoc
    );
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

export async function getDataForExternal(orgName, issuerID, PTID, UID) {
  const { contract, gateway } = await getContract(orgName, issuerID);
  try {
    const results = await contract.evaluateTransaction(
      "getDataForExternal",
      PTID,
      issuerID,
      UID
    );
    return JSON.parse(Buffer.from(results, "base64").toString("ascii"));
  } catch (e) {
    console.log(e);
    throw errors.contract_error.withDetails(
      e.toString().includes("No valid responses from any peers")
        ? e.toString().split("Error:")[2]
        : "An unexpected error"
    );
  } finally {
    gateway.disconnect();
  }
}

export async function checkIfPatientExists(orgName, issuerID, PTID, ORG) {
  const { contract, gateway } = await getContract(orgName, issuerID);
  try {
    await contract.evaluateTransaction("checkIfPatientExists", PTID, ORG);
  } catch (e) {
    throw errors.contract_error.withDetails(
      e.toString().includes("No valid responses from any peers") ||
        e.toString().includes("error in simulation")
        ? e.toString().split("Error:")[2]
        : "An unexpected error has occured while transacting your request. Please try again"
    );
  } finally {
    gateway.disconnect();
  }
}
