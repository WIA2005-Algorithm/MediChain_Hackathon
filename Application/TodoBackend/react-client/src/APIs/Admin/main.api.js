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

export const getAllPatientData = () => axios.get("/entity/getAllPatients");
// TODO
export const getAllDoctorData = () => axios.get("/entity/getAllDoctors");

export const CheckInPatient = (patientID) =>
  axios.post("/entity/checkInPatient", { patientID });

export const AssignDoctor = (patientID, doctorID) =>
  axios.post("/entity/assignPatient", { patientID, doctorID });

// TODO:
export const Discharge = (patientID) => axios.post("/entity/discharge", { patientID });
