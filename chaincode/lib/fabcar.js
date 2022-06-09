"use strict";
const { Contract } = require("fabric-contract-api");
const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { getTypeEHROrDoctor } = require("./Models/ehr.model.js");
const ClientIdentity = require("fabric-shim").ClientIdentity;
const indexedOrgForPatients = "orgDetails~PID";
const indexedOrgForDoctors = "orgDetails~DID";

class FabCar extends Contract {
  async initLedger(ctx) {
    console.info("============= START : Initialize Ledger ===========");
    console.info("============= PROCESS : NOTHING TO DO ===========");
    console.info("============= END : Initialize Ledger ===========");
  }

  /**
   *
   * @param {TxContext} ctx
   * @param {String} PID - Patient ID
   * @param {String} ptDetails - Patient Details
   * @param {String} orgDtails - orgID, orgName, orgAdd
   * @param {String} contact - mobile, other, whatsapp
   * This function adds a patient to the hospital. - [INSERTION]
   * USE SubmitTransaction for this rather than evaluate
   */
  async addPatientEHR(ctx, PID, ptDetails, address, contact) {
    const member = await ctx.stub.getState(PID);
    if (member && member.length !== 0)
      throw new Error(`The patient with given ID already exists`);

    let orgDetails = JSON.parse(this.getOrganizationDetails(ctx));
    const content = getTypeEHROrDoctor(
      JSON.parse(ptDetails),
      orgDetails,
      JSON.parse(address),
      JSON.parse(contact),
      "Patient"
    );
    await ctx.stub.putState(
      PID,
      Buffer.from(
        stringify(
          sortKeysRecursive({
            ...content,
            checkIn: [],
            checkOut: [],
            active: "Not Patients"
          })
        )
      )
    );
    console.log("Putstate Done...Now indexing");
    await this.createOrgIndex(ctx, PID, orgDetails.org.toString(), indexedOrgForPatients);
    return JSON.stringify(content);
  }

  /**
   *
   * @param {TxContext} ctx
   * @param {String} DID - Doctor ID
   * @param {String} docDetails - Doctor Personal Details
   * @param {String} contact - mobile, other, whatsapp
   * This function adds a new doctor to the organization - [INSERTION]
   * USE SubmitTransaction for this rather than evaluate
   */
  async addDoctor(ctx, DID, docDetails, address, contact) {
    const member = await ctx.stub.getState(DID);
    if (member && member.length !== 0)
      throw new Error(`The doctor with ${DID} already exists`);
    let orgDetails = JSON.parse(this.getOrganizationDetails(ctx));
    docDetails = JSON.parse(docDetails);
    const content = getTypeEHROrDoctor(
      docDetails,
      orgDetails,
      JSON.parse(address),
      JSON.parse(contact),
      "Doctor"
    );
    await ctx.stub.putState(
      DID,
      Buffer.from(
        stringify(sortKeysRecursive({ ...content, active: ["Active", "Unoccupied"] }))
      )
    );
    await this.createOrgIndex(ctx, DID, orgDetails.org.toString(), indexedOrgForDoctors);
    return JSON.stringify(content);
  }

  async checkInPatient(ctx, PID) {
    let patient = await ctx.stub.getState(PID);
    if (
      !patient ||
      patient.length === 0 ||
      !JSON.parse(patient).orgDetails.role.toLowerCase().includes("patient")
    )
      throw new Error("The patient identity does not exist.");
    patient = JSON.parse(patient);
    if (patient.checkIn.length === patient.checkOut.length) {
      patient.checkIn.push(this.toDate(ctx.stub.getTxTimestamp()));
      patient.active = this.getStatus(
        patient.checkIn,
        patient.checkOut,
        patient.associatedDoctors
      );
      await ctx.stub.putState(PID, Buffer.from(stringify(patient)));
    } else
      throw new Error(
        "The patient is already checked in. Please checkout the patient and try again."
      );
  }

  // TODO:::
  async dischargeORCheckOutPatient(ctx, PID) {}
  /**
   *
   * @param {Context} ctx - Transaction
   * @param {String} PID - PatientID
   * @param {String} DID - DoctorID
   * This function assigns patient to doctor... [UPDATE]
   * USE SubmitTransaction for this rather than evaluate
   * Patients can be assigned to doctors only by admins
   */
  async assignPatientToDoctor(ctx, PID, DID) {
    let [doctype, doctor] = await this.getMemberType(ctx, DID);
    console.log(" HUHUHUUHUH 1...");
    if (
      doctype !== "Admin" ||
      !JSON.parse(doctor.toString())
        .orgDetails.role.toString()
        .toLowerCase()
        .includes("doctor")
    )
      throw new Error("Patient can only be registered to an in-hospital doctor.");
    let [_, patient] = await this.getMemberType(ctx, PID);
    console.log(" HUHUHUUHUH 2...");
    patient = JSON.parse(patient.toString());
    console.log(" HUHUHUUHUH 3...");
    doctor = JSON.parse(doctor.toString());
    console.log(" HUHUHUUHUH 4...");
    if (doctor.orgDetails.org !== patient.orgDetails.org)
      throw new Error("Patient can only be registered to in-hospital doctor.");
    if (doctor.associatedPatients[PID])
      throw new Error(
        "Requested doctor has already been assigned to this patient...Please dissolve them first then assign again for new entry or reset status altogether"
      );
    if (patient.checkIn.length === patient.checkOut.length)
      throw new Error(
        "Patient has not yet been checked-In. Please check-In the patient first"
      );
    // Update the details
    const ptObj = {
      name: `${patient.details.firstName} ${patient.details.middleName} ${patient.details.lastName}`,
      active: "Actively Watched",
      assignedOn: this.toDate(ctx.stub.getTxTimestamp()),
      dischargeOk: null
    };
    const docObj = {
      name: `${doctor.details.firstName} ${doctor.details.middleName} ${doctor.details.lastName}`,
      department: doctor.details.department,
      assignedOn: this.toDate(ctx.stub.getTxTimestamp()),
      active: ["Verified", "In-progress"],
      note: "Patient is currently being examined",
      EMRID: -500,
      dischargeOk: null
    };
    doctor.associatedPatients[PID] = ptObj;
    doctor.active = ["Active", "Occupied"];
    patient.associatedDoctors[DID] = docObj; // Tag to recognize no record has yet been registered in the name of this patient
    patient.active = this.getStatus(
      patient.checkIn,
      patient.checkOut,
      patient.associatedDoctors
    );
    await ctx.stub.putState(DID, Buffer.from(stringify(doctor)));
    await ctx.stub.putState(PID, Buffer.from(stringify(patient)));
  }

  /**
   * @param {TxContext} ctx
   * @param {String} PID - Patient ID
   * @returns {Buffer} Patient Object
   * Utitlity/Useful function to get Patient Details from patient ID
   * USE EvaluateTransaction
   */
  async getPatientDetails(ctx, PID) {
    const [_, patient] = await this.getMemberType(ctx, PID);
    return patient.toString();
  }

  async getPatientRecords(ctx, PID) {
    //PHR and EMR if neccessary
    //FUNCTION ASSOCIATED TO ABOVE FUNCTION...
  }

  /**
   *
   * @param {TxContext} ctx
   * @param {String} DID - Doctor ID
   * @returns {Buffer} Doctor Object
   * function to get Patient Details from doctor ID
   * USE EvaluateTransaction
   */
  async getDoctorDetails(ctx, DID) {
    const [doctype, doctor] = await this.getMemberType(ctx, DID);
    if (doctype === "Doctor" || doctype === "Admin") return doctor.toString();
    throw new Error("Invalid Host Request...");
  }

  async getAllPatientsForDoctor(ctx, DID) {
    const [doctype, doc] = await this.getMemberType(ctx, DID);
    if (doctype !== "Doctor" && doctype !== "Admin")
      throw new Error("Invalid Host Request...");
    const ptIDs = JSON.parse(doc).associatedPatients;
    const allPatients = [];
    for (const id of ptIDs) {
      // OMITTING OrgDetails, secretShaingPair
      const { secretSharingPair, ...res } = await ctx.stub.getState(id);
      allPatients.push(JSON.parse(res));
    }
    return JSON.stringify(allPatients);
  }

  async getAllDoctorsForPatient(ctx, PID) {
    const [type, patient] = await this.getMemberType(ctx, PID);
    if (!JSON.parse(patient).orgDetails.role.toString().toLowerCase().includes("patient"))
      throw new Error("Patient Identity does not exists...");

    const docIDs = JSON.parse(patient).associatedDoctors;
    const allDoctors = [];
    await Promise.all(
      Object.keys(docIDs).map(async (key) => {
        const object = await ctx.stub.getState(key);
        // OMITTING OrgDetails, secretShaingPair Key, associatedPatients of Doctor for User other than Admin
        const { secretSharingPair, ...objAdmin } = object;
        const { associatedPatients, ...obj } = objAdmin;
        allDoctors.push(JSON.parse(type === "Admin" ? objAdmin : obj));
      })
    );
    return JSON.stringify(allDoctors);
  }

  getOrganizationDetails(ctx) {
    const cid = new ClientIdentity(ctx.stub);
    console.log(cid);
    return stringify({
      role: cid.getAttributeValue("hf.Affiliation"),
      org: cid.getMSPID()
    });
  }

  toDate(timestamp) {
    const milliseconds =
      (timestamp.seconds.low + timestamp.nanos / 1000000 / 1000) * 1000;
    return milliseconds;
  }

  getStatus(checkIn, checkOut, docs) {
    if (checkIn.length >= checkOut.length) {
      if (Object.keys(docs).length === 0) return "Waiting To Be Assigned";
      for (const key of Object.keys(docs))
        if (!docs[key].dischargeOk) return "Actively Watched";
      return "Waiting For Discharge";
    }
    return "Not Patients";
  }
  async createOrgIndex(ctx, ID, orgDetails, index) {
    await ctx.stub.putState(
      await ctx.stub.createCompositeKey(index, [orgDetails, ID]),
      Buffer.from("\u0000")
    );
  }

  async helperFunctionToGetIndexedData(ctx, index, mspid) {
    let ResultsIterator = await ctx.stub.getStateByPartialCompositeKey(index, [mspid]);
    let response = await ResultsIterator.next();
    const allDataArray = [];
    while (!response.done) {
      if (!response || !response.value || !response.value.key) return;
      let attributes, _;
      ({ _, attributes } = await ctx.stub.splitCompositeKey(response.value.key));
      let returnedAssetName = attributes[1];
      const v = await ctx.stub.getState(returnedAssetName);
      allDataArray.push(JSON.parse(v.toString()));
      response = await ResultsIterator.next();
    }

    return allDataArray;
  }
  /**
   * GETS ALL THE PATIENTS IN THE CURRENT HOSPITAL CONTEXT
   * @param {TxContext} - Context
   * @param {String} - Doctor ID
   * @returns
   */
  async getAllPatients(ctx) {
    const [type, mspid] = await this.getMemberType(ctx, "0");
    if (type !== "Admin")
      throw new Error("You are unauthorized to access this part of the site...");
    return JSON.stringify(
      await this.helperFunctionToGetIndexedData(ctx, indexedOrgForPatients, mspid)
    );
  }

  /**
   * GETS ALL THE DOCTORS IN THE CURRENT HOSPITAL CONTEXT
   * @param {TxContext} - Context
   * @param {String} - Doctor ID
   * @returns
   */
  async getAllDoctors(ctx) {
    const [type, mspid] = await this.getMemberType(ctx, "0");
    if (type !== "Admin")
      throw new Error("You are unauthorized to access this part of the site...");
    return JSON.stringify(
      await this.helperFunctionToGetIndexedData(ctx, indexedOrgForDoctors, mspid)
    );
  }

  /**
   * @param {TxContext} ctx
   * @param {String} id - Member ID
   * @returns {String} - [Admin, Patient, Doctor]
   */
  async getMemberType(ctx, id) {
    let member = await ctx.stub.getState(id);
    const cid = new ClientIdentity(ctx.stub);
    if (cid.getAttributeValue("orgAdmin")) {
      if (!member || member.length === 0) return ["Admin", cid.getMSPID()];
      else return ["Admin", member];
    }
    if (!member || member.length === 0)
      throw new Error(
        "Either the identity does not exists or you are entering an unauthorized zone."
      );
    else {
      if (cid.getAttributeValue("hf.Affiliation").toLowerCase().includes("patient"))
        if (
          cid.getAttributeValue("hf.Affiliation") === JSON.parse(member).orgDetails.role
        )
          return ["Patient", member];
        else
          throw new Error(
            "Invalid Host Identity. You are unauthorized to access this part of the site"
          );
      else return ["Doctor", member];
    }
  }

  async queryAllCars(ctx) {
    const startKey = "";
    const endKey = "";
    const allResults = [];
    for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
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
