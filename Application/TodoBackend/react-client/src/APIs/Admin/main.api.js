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
        type: "admin",
    });

export const getHospitalsEnrolled = () =>
    axios.get("/entity/getEnrolledHospitals");

export const addNewPatientAPI = (
    loginDetails,
    personalDetails,
    address,
    contactDetails
) =>
    axios.post("/entity/addNewPatient/onBehalf", {
        payloadData: { loginDetails, personalDetails, address, contactDetails },
    });
