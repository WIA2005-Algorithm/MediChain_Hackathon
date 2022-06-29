import axios from "axios";
import { _token } from "../../Components/UserAuth";

axios.interceptors.request.use((config) => {
  config.headers.Authorization = _token?.accessToken;
  return config;
});

export const getPatientInfo = () => axios.get("/patient/getPatient");

export const acceptRequestToFromDoctors = (data, name, notifObj) => {
  return axios.post("/patient/acceptRequestToFromDoctors", {
    data,
    name,
    notifObj
  });
};

export const denyRequestToFromDoctors = (data, name, note, notifObj) => {
  console.log("RECIEVING AND SENDING - 1 -", data, name, note, notifObj);
  return axios.post("/patient/denyRequestToFromDoctors", {
    data,
    name,
    note,
    notifObj
  });
};
