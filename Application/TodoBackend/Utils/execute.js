'use strict'
import shell from "shelljs";
import dotenv from "dotenv";
import { setNetworkStatus } from "../controllers/CreateNetwork.controller.js";
dotenv.config();
const {ROOT_APP_DIR, CREATE_NETWORK_TEMPLATE_FOLDER, PASSWORD} = process.env;

function trigger() {
    shell.config.silent = !shell.config.silent;
}

export function generateNetworkFiles(execStr, NetworkName) {
    setNetworkStatus(NetworkName, {code: 300, message: "Pending", description: "Fabric Network is starting. Please wait"})
    .then(()=>console.log("Status changed"))
    .catch((err)=> console.log(err.message));
    const dir = shell.exec(`find ${ROOT_APP_DIR} -name \"${CREATE_NETWORK_TEMPLATE_FOLDER}\" 2>/dev/null`).stdout.trim();
    shell.config.silent = true;
    shell.pushd(dir);
    trigger();
    shell.exec(`./generateNetwork.sh ${execStr}`, (code) => {
        if(code != "0")
        setNetworkStatus(NetworkName, {code: 500, message: "Failed to start", description: "Failed to generate fabric network"})
        .then(()=>console.log("Status changed"))
        .catch((err)=> console.log(err.message));
        else
        StartNetwork(NetworkName);
    });
    trigger();
    shell.popd();
    trigger();
}

function StartNetwork(NetworkName) {
        shell.config.silent = true;
        shell.pushd(`${ROOT_APP_DIR}/Application/`)
        trigger();
        shell.exec(`echo "${PASSWORD}" | sudo -S "./startFabric.sh"`, function(code) {
            if(code != "0")
            setNetworkStatus(NetworkName, {code: 500, message: "Failed to start", description: "Failed to start the fabric network, files were generated successfully"})
            .then(()=>console.log("Status changed"))
            .catch((err)=> console.log(err.message));
            else
            setNetworkStatus(NetworkName, {code: 200, message: "Success", description: "Fabric network is started successfully"})
            .then(()=>console.log("Status changed"))
            .catch((err)=> console.log(err.message));
          });
        trigger();
        shell.popd();
    trigger(); 
}; 

export function StopNetwork(NetworkName) {
    setNetworkStatus(NetworkName, {code: 300, message: "Pending", description: "Fabric Network is stopping. Please wait"})
    .then(()=>console.log("Status changed"))
    .catch((err)=> console.log(err.message));
    shell.config.silent = true;
    shell.pushd(`${ROOT_APP_DIR}/Application/`)
    trigger();
    shell.exec(`echo "${PASSWORD}" | sudo -S "./networkDown.sh"`, function(code) {
        if(code != "0")
        setNetworkStatus(NetworkName, {code: 400, message: "Failed to Stop", description: "Fabric Network has failed stopped successfully"});
        else
        setNetworkStatus(NetworkName, {code: 0, message: "Stopped", description: "Fabric Network is stopped successfully"})
        .then(()=>console.log("Status changed"))
        .catch((err)=> console.log(err.message));
        });
    trigger();
    shell.popd();
    trigger();

};