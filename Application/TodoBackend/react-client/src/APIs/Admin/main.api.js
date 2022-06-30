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

export const getHospitalsEnrolled = (substract = null) =>
  axios.get("/entity/getEnrolledHospitals", { params: { substract } });

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

export const Discharge = (patientID) =>
  axios.post("/entity/checkOutPatient", { patientID });
export const PatientDataStatsCheckInCheckOut = (fromRange, toRange) =>
  axios.get("/entity/getPatientCheckInCheckOutStats", {
    params: {
      fromRange,
      toRange
    }
  });

export const getPatientDetails = (ID) => {
  return axios.get("/entity/getPatientDetails", { params: { ID } });
};

export const acceptExternalDoctorRequest = (selectedEMR, data, notifObj) => {
  return axios.post("/entity/acceptExternalDoctorRequest", {
    selectedEMR,
    data,
    notifObj
  });
};

export const denyExternalDoctorRequest = (data, note, notifObj) => {
  return axios.post("/entity/denyExternalDoctorRequest", { data, note, notifObj });
};

export const getPatientDataStatsTimeLine = (fromRange, toRange, time) =>
  axios.get("/entity/getPatientDataStatsTimeLine", {
    params: {
      fromRange,
      toRange,
      time
    }
  });
