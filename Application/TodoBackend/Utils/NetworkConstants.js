'use-strict';
import path from 'path'
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const channelName = 'mychannel';
export const chaincodeName = 'todo';
export const walletPath = path.join(__dirname,'..', 'wallet');
export const organisationPath = (orgName) => path.resolve(__dirname, '..', '..', '..', 'ApplicationNetwork', 'organizations', 'peerOrganizations', `${orgName.toLowerCase()}.um.edu.my`, `connection-${orgName.toLowerCase()}.json`);

export const p0ports = [7051, 9051, 1051, 2051];
export const caports = [7054, 8054, 1054, 2054];
export const couchports = [5984, 7984, 9984, 8984];
//console Colors
export const black = "\x1b[30m"
export const red = "\x1b[31m"
export const green = "\x1b[32m"
export const yellow = "\x1b[33m"
export const blue = "\x1b[34m"
export const magenta = "\x1b[35m"
export const cyan = "\x1b[36m"
export const white = "\x1b[37m"