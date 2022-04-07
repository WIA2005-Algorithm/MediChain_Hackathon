import { getContract } from "../Utils/CAUtil.js";
import errors from "../Utils/Errors.js";

export async function addMember(orgName, userID) {
    const {contract, gateway} = await getContract(orgName, userID);
    try {
        const result = await contract.submitTransaction(
            "addPatientEHR",
            "01",
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
