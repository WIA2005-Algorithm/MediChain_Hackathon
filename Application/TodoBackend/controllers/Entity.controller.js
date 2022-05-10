import { HospitalEntity } from "../models/Entity.model.js";

export const createAdminEntity = async (EntityObj) => {
    const EOBJ = HospitalEntity.create(EntityObj);
    console.log("\n>> Created Entity User Successfully:\n", EOBJ);
    return EOBJ;
};
