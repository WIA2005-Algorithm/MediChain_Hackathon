import errors from "../Utils/Errors.js";
import { getContract } from "../Utils/CAUtil.js";

export async function acceptRequestToFromDoctors(orgName, issuerID, UID, FromDOCID) {
  const { contract, gateway } = await getContract(orgName, issuerID);
  console.log(" HERE 2");
  try {
    await contract.submitTransaction(
      "acceptRequestToFromDoctors",
      issuerID,
      UID,
      FromDOCID
    );
    console.log(" HERE 3");
  } catch (e) {
    console.log(e);
    console.log(" HERE 2.1");
    throw errors.contract_error.withDetails(
      e.toString().includes("No valid responses from any peers")
        ? e.toString().split("Error:")[2]
        : "An unexpected error has occured while transacting your request. Please try again"
    );
  } finally {
    gateway.disconnect();
  }
}
