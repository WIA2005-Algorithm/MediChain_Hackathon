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
export const uploadFile = (file, PTID, DOCID) =>
  axios.post("/doctor/uploadPatientFile", {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    file,
    PTID,
    DOCID
  });

// Still TODO
export const dischargePTForDoctor = (PTID, DOCID, NOTE) => {
  console.log(NOTE);
  return axios.post("/doctor/dischargePTForDoctor", {
    PTID,
    DOCID,
    NOTE
  });
};
