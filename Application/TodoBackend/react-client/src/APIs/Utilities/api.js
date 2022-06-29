import axios from "axios";
import { _token } from "../../Components/UserAuth";

axios.interceptors.request.use((config) => {
  config.headers.Authorization = _token?.accessToken;
  return config;
});

export const markNotificationRead = (_id) => axios.post("/markNotificationRead", { _id });
export const getNotificationData = () => axios.get("/getNotificationData");
export const getRequestData = () => axios.get("/getRequestData");
