import axios from "axios";
import { _token } from "../../Components/UserAuth";

axios.interceptors.request.use((config) => {
  config.headers.Authorization = _token?.accessToken;
  return config;
});

export const getDoctorInfo = () => axios.get("/doctor/getDoctor");
export const getPatientInfo = (ID) =>
  axios.get("/doctor/getPatient", { params: { ptID: ID } });
