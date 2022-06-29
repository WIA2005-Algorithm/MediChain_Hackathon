import axios from "axios";
import { _token } from "../../Components/UserAuth";

axios.interceptors.request.use((config) => {
  config.headers.Authorization = _token?.accessToken;
  return config;
});

export const getDoctorInfo = () => axios.get("/doctor/getDoctor");
export const getPatientInfo = (ID) =>
  axios.get("/doctor/getPatient", { params: { ptID: ID } });

// Still TODO
export const uploadFile = (formData) =>
  axios.post("/doctor/uploadPatientFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

export const dischargePTForDoctor = (PTID, DOCID, NOTE) => {
  return axios.post("/doctor/dischargePTForDoctor", {
    PTID,
    DOCID,
    NOTE
  });
};

export const requestExternalPatient = (docName, PTID, PTORG) => {
  PTORG = String(PTORG.split("-")[1]).trim();
  console.log(PTORG);
  return axios.post("/doctor/requestExternalPatient", {
    docName,
    PTID,
    PTORG
  });
};

export const acceptRequestToFromAdmin = (data, doctor, notifObj) => {
  return axios.post("/doctor/acceptRequestToFromAdmin", { data, doctor, notifObj });
};

export const denyRequestToFromAdmin = (data, note, others, notifObj) => {
  console.log("HELLO1---", data, note, others, notifObj);
  return axios.post("/doctor/denyRequestToFromAdmin", { data, note, others, notifObj });
};
