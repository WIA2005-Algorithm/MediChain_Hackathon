import shell from "shelljs";
import dotenv from "dotenv";
import errors from './Errors.js';
dotenv.config();
const {ROOT_APP_DIR, CREATE_NETWORK_TEMPLATE_FOLDER, PASSWORD} = process.env;

function trigger() {
    shell.config.silent = !shell.config.silent;
}

export function generateNetworkFiles(execStr) {
    const dir = shell.exec(`find ${ROOT_APP_DIR} -name \"${CREATE_NETWORK_TEMPLATE_FOLDER}\" 2>/dev/null`).stdout.trim();
    shell.config.silent = true;
    shell.pushd(dir);
    trigger();
    shell.exec(`./generateNetwork.sh ${execStr}`, (code) => {
        if(code != "0")
        throw new errors.execution_failed.withDetails("Error while generating the network configuration...Please check logs for more information");
        else
        StartNetwork();
    });
    trigger();
    shell.popd();
    trigger();
}

function StartNetwork() {
        shell.config.silent = true;
        shell.pushd(`${ROOT_APP_DIR}/Application/`)
        trigger();
        shell.exec(`echo "${PASSWORD}" | sudo -S "./startFabric.sh"`, function(code) {
            if(code != "0")
            throw new errors.execution_failed.withDetails("Error while starting the network...Please check logs for more information");
          });
        trigger();
        shell.popd();
    trigger(); 
}; 

export function StopNetwork() {
    shell.config.silent = true;
    shell.pushd(`${ROOT_APP_DIR}/Application/`)
    trigger();
    shell.exec(`echo "${PASSWORD}" | sudo -S "./networkDown.sh"`, function(code, stdout, stderr) {
        if(code != "0")
           throw new errors.execution_failed.withDetails("Error while stopping the network...Please check logs for more information");
        });
    trigger();
    shell.popd();
    trigger();

};