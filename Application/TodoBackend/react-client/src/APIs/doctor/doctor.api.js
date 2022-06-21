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
