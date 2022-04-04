"use strict";
const { Contract } = require("fabric-contract-api");
const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { getTypeEHROrDoctor } = require("./Models/ehr.model.js");
const ClientIdentity = require("fabric-shim").ClientIdentity;
const indexedOrg = "orgDetails~PID";

class FabCar extends Contract {
    async initLedger(ctx) {
        console.info("============= START : Initialize Ledger ===========");
        console.info("============= PROCESS : NOTHING TO DO ===========");
        // await this.addPatientEHR(
        //     ctx,
        //     "12-34",
        //     {
        //         firstName: "Kamal",
        //         lastName: "Kumar Khatri",
        //         gender: "Male",
        //         DOB: "06/23/2001",
        //         street: null,
        //         zip: null,
        //         city: "Salalah",
        //         state: null,
        //         country: "Oman",
        //     },
        //     {
        //         orgID: "Org1MSP",
        //         orgName: "UMMC",
        //         orgAddress: "ummc.um.edu.my",
        //     },
        //     {
        //         mobile: "+96894637602",
        //         other: null,
        //         whatsapp: null,
        //     }
        // );

        // await this.addDoctor(
        //     ctx,
        //     "132-234",
        //     {
        //         firstName: "Raja",
        //         lastName: "Mal Khatri",
        //         gender: "Male",
        //         DOB: "12/20/1987",
        //         street: null,
        //         zip: null,
        //         city: "Hyderabad",
        //         state: "Sindh",
        //         country: "Pakistan",
        //     },
        //     {
        //         orgID: "Org1MSP",
        //         orgName: "UMMC",
        //         orgAddress: "ummc.um.edu.my",
        //     },
        //     {
        //         mobile: "+96894637602",
        //         other: null,
        //         whatsapp: null,
        //     }
        // );
        // await new Promise((r) => setTimeout(r, 10000));
        // console.log("timer");
        // await this.retriveCompositeUsingKey(
        //     ctx,
        //     JSON.stringify({
        //         orgID: "Org1MSP",
        //         orgName: "UMMC",
        //         orgAddress: "ummc.um.edu.my",
        //     })
        // );
        console.info("============= END : Initialize Ledger ===========");
    }

    /**
     *
     * @param {TxContext} ctx
     * @param {String} PID - Patient ID
     * @param {JSON_String} ptDetails - Patient Details
     * @param {JSON_String} orgDtails - orgID, orgName, orgAdd
     * @param {String} contact - mobile, other, whatsapp
     */
    // This function adds a patient to the hospital.
    async addPatientEHR(ctx, PID, ptDetails, contact) {
        console.log("Entered Add Patient EHR");
        const exists = await this.memberExists(ctx, PID);
        console.log("Entering the getOrganizationDetails");
        const orgDetails = this.getOrganizationDetails(ctx);
        console.log("Returned");
        if (exists && exists.length > 0) {
            throw new Error(`The patient with ${PID} already exists`);
        }
        const content = getTypeEHROrDoctor(
            JSON.parse(ptDetails),
            orgDetails,
            JSON.parse(contact),
            "Patient"
        );
        console.log("Content is : \n", content);
        await ctx.stub.putState(
            PID,
            Buffer.from(stringify(sortKeysRecursive(content)))
        );
        console.log("Putstate Done...Now indexing");
        await this.createOrgIndex(ctx, PID, JSON.stringify(orgDetails));
        return JSON.stringify(content);
    }

    async addDoctor(ctx, DID, docDetails, contact) {
        const exists = await this.memberExists(ctx, DID);
        if (exists && exists.length > 0) {
            throw new Error(`The doctor with ${DID} already exists`);
        }
        const content = getTypeEHROrDoctor(
            docDetails,
            this.getOrganizationDetails(),
            contact,
            "Doctor"
        );
        await ctx.stub.putState(
            DID,
            Buffer.from(stringify(sortKeysRecursive(content)))
        );
    }

    async assignPatientToDoctor(ctx, PID, DID) {
        let patient = this.memberExists(PID);
        // Check for existing and all neccessary errors
        if (!patient || patient.length === 0)
            throw new Error("Patient Identity does not exists...");
        let doctor = this.memberExists(DID);
        if (!doctor || doctor.length === 0)
            throw new Error("Doctor Identity does not exists...");
        patient = JSON.parse(patient.toString());
        doctor = JSON.parse(patient.toString());
        console.log(patient, doctor);
        if (
            JSON.stringify(patient.orgDetails.org) ===
            JSON.stringify(doctor.orgDetails.org)
        )
            throw new Error(
                "Patient can only be registered to in-hospital doctor."
            );
        if (doctor.associatedPatients.includes(PID))
            throw new Error(
                "Doctor is already assigned to this patient...Please remove first then assign again for new entry"
            );

        // Update the details
        doctor.associatedPatients.push(PID);
        patient.associatedDoctors.DID = null;
        ctx.stub.putState(DID, Buffer.from(stringify(doctor)));
        ctx.stub.putState(PID, Buffer.from(stringify(patient)));
    }

    async getOrganizationDetails(ctx) {
        console.log("Entered...");
        const cid = new ClientIdentity(ctx.stub);
        console.log("Identity : ", cid)
        console.log("Attribute: ", cid.getAttributeValue("hf.Affiliation"));
        console.log("OrgAdd : ", cid.getX509Certificate().issuer.organizationName);
        return {
            role: cid.getAttributeValue("hf.Affiliation"),
            org: {
                orgID: cid.getMSPID(),
                orgAdd: cid.getX509Certificate().issuer.organizationName,
            },
        };
    }

    async createOrgIndex(ctx, PID, orgDetails) {
        await ctx.stub.putState(
            await ctx.stub.createCompositeKey(indexedOrg, [orgDetails, PID]),
            Buffer.from("\u0000")
        );
    }

    async retriveCompositeUsingKey(ctx, orgDetails) {
        let ResultsIterator = await ctx.stub.getStateByPartialCompositeKey(
            indexedOrg,
            [orgDetails]
        );

        // Iterate through result set and for each asset found, transfer to newOwner
        let response = await ResultsIterator.next();
        console.log(response);
        while (!response.done) {
            if (!response || !response.value || !response.value.key) {
                console.log("2", response);
                return;
            }

            let objectType, attributes;
            ({ objectType, attributes } = await ctx.stub.splitCompositeKey(
                response.value.key
            ));
            console.log("3", objectType, "::", attributes);
            let returnedAssetName = attributes[1];
            const v = await ctx.stub.getState(returnedAssetName);
            console.log(v);
            response = await ResultsIterator.next();
        }
    }

    async memberExists(ctx, id) {
        console.log("Returning exists or not");
        return await ctx.stub.getState(id);
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, make, model, color, owner) {
        console.info("============= START : Create Car ===========");

        const car = {
            color,
            docType: "car",
            make,
            model,
            owner,
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info("============= END : Create Car ===========");
    }

    async queryAllCars(ctx) {
        const startKey = "";
        const endKey = "";
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(
            startKey,
            endKey
        )) {
            const strValue = Buffer.from(value).toString("utf8");
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info("============= START : changeCarOwner ===========");

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info("============= END : changeCarOwner ===========");
    }
}

module.exports = FabCar;
