import axios from "axios";
import { _token } from "../../Components/UserAuth";

axios.interceptors.request.use((config) => {
    console.log(_token.accessToken);
    config.headers.Authorization = _token.accessToken;
    return config;
});

export const updateToken = (token) =>
    axios.post("/update-token", {
        refreshToken: token,
    });

export const loginAuth = (username, password) =>
    axios.post("/superuser/login", {
        username: username,
        password: password,
    });

export const createNetwork = (networkID, networkName, networkAdd) =>
    axios.post("/superuser/create/network", {
        name: networkName,
        netID: networkID,
        address: networkAdd,
    });

export const createOrganization = (
    networkName,
    fullName,
    id,
    adminID,
    password,
    country,
    state,
    location
) =>
    axios.post("/superuser/create/organization", {
        networkName,
        fullName,
        id,
        adminID,
        password,
        country,
        state,
        location,
    });

export const startNetwork = (name) =>
    axios.post("/superuser/network/start", {
        networkName: name,
    });

export const stopNetwork = (name) =>
    axios.post("/superuser/network/stop", {
        networkName: name,
    });

export const getNetworkCount = () => axios.get("/superuser/network/count");
export const getAllNetworks = () => axios.get("/superuser/network/all");
export const getNetworkStatus = () => axios.get("/superuser/network/status");
export const getNetworkExists = (name) =>
    axios.get("/superuser/network/exists", {
        params: {
            networkName: name,
        },
    });

export const deleteOrganization = (networkName, org) =>
    axios.delete(`/superuser/organizations/${networkName}/${org}`);

export const enrollAdmin = (orgName) => axios.post(`/superuser/organizations/${orgName}/enroll`);

export const getSystemLogs = () => axios.post('/systemLogs');