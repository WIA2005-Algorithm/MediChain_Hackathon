import axios from "axios";

export const loginAuth = (username, password) => axios.post('/superuser/login', {
    username: username,
    password: password
  })

  export const createNetwork = (networkID, networkName, networkAdd) => axios.post('/superuser/create/network', {
    name: networkName,
    netID: networkID,
    address: networkAdd
  })

  export const startNetwork = (name) => axios.post('/superuser/network/start', {
    networkName: name
  });
  export const stopNetwork = (name) => axios.post('/superuser/network/stop', {
    networkName: name
  });

  export const getNetworkCount = () => axios.get('/superuser/network/count');
  export const getAllNetworks = () => axios.get('/superuser/network/all');
  export const getNetworkStatus = () => axios.get('/superuser/network/status');
  export const getNetworkExists = (name) => axios.get('/superuser/network/exists', {
    params: {
      networkName: name
    }
  });

  export const deleteOrganization = (networkName, org) => axios.delete(`/superuser/organizations/${networkName}/${org}`);