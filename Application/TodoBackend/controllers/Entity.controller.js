import { HospitalEntity } from "../models/Entity.model.js";
import { getContract } from "../Utils/CAUtil.js";
import errors from "../Utils/Errors.js";

export const createAdminEntity = async (EntityObj) => {
  const EOBJ = HospitalEntity.create(EntityObj);
  console.log("\n>> Created Entity User Successfully");
  return EOBJ;
};

export const deleteAdminEntity = async (userID) =>
  await HospitalEntity.findOneAndDelete({ userID });

export async function addMember(
  orgName,
  userID,
  details,
  transactionType = "addPatientEHR"
) {
  const { contract, gateway } = await getContract(orgName, userID);
  try {
    const result = await contract.submitTransaction(
      transactionType,
      userID,
      JSON.stringify(details.personalDetails),
      JSON.stringify(details.address),
      JSON.stringify(details.contactDetails)
    );
    console.log(result.toString());
    gateway.disconnect();
  } catch (e) {
    throw errors.contract_error.withDetails(e.toString());
  }
}

export async function retriveAllPatients(orgName, ID) {
  console.log(" INSIDE RETRIVER ALL - 1");
  const { contract, gateway } = await getContract(orgName, ID);
  try {
    const result = await contract.evaluateTransaction("getAllPatients");
    console.log(result.toString());
    gateway.disconnect();
    return JSON.parse(result.toString());
  } catch (e) {
    throw errors.contract_error.withDetails(e.toString());
  }
}
