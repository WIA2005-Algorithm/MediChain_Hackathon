import shell from "shelljs";
import dotenv from "dotenv";
import errors from './Errors.js';
dotenv.config();
const {ROOT_APP_DIR, CREATE_NETWORK_TEMPLATE_FOLDER, PASSWORD} = process.env;

function trigger() {
    shell.config.silent = !shell.config.silent;
}

async function CreateNetwork() {
    const dir = shell.exec(`find ${ROOT_APP_DIR} -name \"${CREATE_NETWORK_TEMPLATE_FOLDER}\" 2>/dev/null`).stdout.trim();
    shell.config.silent = true;
    shell.pushd(dir);
    trigger();
    shell.exec('./generateNetwork.sh -netName Medi_Chain -netID mvn -netAdd um.edu.my -org UMMC Asura Asurapw Malaysia Selongor "KL" 7051 7054 5984 -org PPUM BAsura BAsurapw Malaysia Selongor "KL" 9051 8054 7984', (code) => {
        if(code != "0")
        throw new errors.execution_failed.withDetails("Error while generating the network configuration...Please check logs for more information");
    });
    trigger();
    shell.popd();
    trigger();
}

async function StartNetwork() {
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

async function StopNetwork() {
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