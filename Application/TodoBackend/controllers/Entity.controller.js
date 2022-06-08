import { HospitalEntity } from "../models/Entity.model.js";
import { getContract } from "../Utils/CAUtil.js";
import errors from "../Utils/Errors.js";

export const createEntity = async (EntityObj) => {
  const EOBJ = HospitalEntity.create(EntityObj);
  console.log("\n>> Created Entity User Successfully");
  return EOBJ;
};

export const deleteAdminEntity = async (userID) =>
  await HospitalEntity.findOneAndDelete({ userID });

export async function addMember(orgName, userID, details, transactionType) {
  const { contract, gateway } = await getContract(orgName, userID);
  console.log(details.personalDetails);
  try {
    const result = await contract.submitTransaction(
      transactionType,
      userID,
      JSON.stringify(details.personalDetails),
      JSON.stringify(details.address),
      JSON.stringify(details.contactDetails)
    );
    console.log(result.toString());
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

export async function retriveAllPatients(orgName, issuerID) {
  console.log(" INSIDE RETRIVER ALL - 1");
  const { contract, gateway } = await getContract(orgName, issuerID);
  try {
    const result = await contract.evaluateTransaction("getAllPatients");
    console.log(result.toString());
    return JSON.parse(result.toString());
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

export async function retriveAllDoctors(orgName, issuerID) {
  console.log(" INSIDE RETRIVER ALL - 1");
  const { contract, gateway } = await getContract(orgName, issuerID);
  try {
    const result = await contract.evaluateTransaction("getAllDoctors");
    console.log(result.toString());
    return JSON.parse(result.toString());
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

export async function checkIn(orgName, issuerID, PtID) {
  const { contract, gateway } = await getContract(orgName, issuerID);
  try {
    await contract.submitTransaction("checkInPatient", PtID);
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

export async function assign(orgName, issuerID, PtID, DtID) {
  const { contract, gateway } = await getContract(orgName, issuerID);
  try {
    await contract.submitTransaction("assignPatientToDoctor", PtID, DtID);
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

export async function dischargeORCheckOutPatient(orgName, issuerID, PtID) {
  const { contract, gateway } = await getContract(orgName, issuerID);
  try {
    await contract.submitTransaction("dischargeORCheckOutPatient", PtID);
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
