import axios from "axios";
import { _token } from "../../Components/UserAuth";

axios.interceptors.request.use((config) => {
  config.headers.Authorization = _token?.accessToken;
  return config;
});

export const adminLoginAuth = (username, password) =>
  axios.post("/entity/login", {
    userID: username,
    password: password,
    type: "admin"
  });

export const getHospitalsEnrolled = () => axios.get("/entity/getEnrolledHospitals");

export const addNewPatientOrDoctorAPI = (
  loginDetails,
  personalDetails,
  address,
  contactDetails,
  onBehalf
) =>
  axios.post("/entity/addNewPatient/onBehalf", {
    payloadData: { loginDetails, personalDetails, address, contactDetails },
    onBehalf
  });

export const loginOnBehalfOF = (username, password) =>
  axios.post("/entity/addNewPatient/onBehalf/Change", {
    userID: username,
    password
  });

export const patientLoginAuth = (username, password) =>
  axios.post("/entity/login", {
    userID: username,
    password: password,
    type: "patient"
  });

export const doctorLoginAuth = (username, password) =>
  axios.post("/entity/login", {
    userID: username,
    password: password,
    type: "doctor"
  });
export const getAllPatientData = () => axios.get("/entity/getAllPatients");
export const getAllDoctorData = () => axios.get("/entity/getAllDoctors");

export const CheckInPatient = (patientID) =>
  axios.post("/entity/checkInPatient", { patientID });

export const AssignDoctor = (patientID, doctorID) =>
  axios.post("/entity/assignPatient", { patientID, doctorID });

export const Discharge = (patientID) => {
  console.log(patientID);
  axios.post("/entity/checkOutPatient", { patientID });
};
export const PatientDataStatsCheckInCheckOut = (fromRange, toRange) =>
  axios.get("/entity/getPatientCheckInCheckOutStats", {
    params: {
      fromRange,
      toRange
    }
  });
