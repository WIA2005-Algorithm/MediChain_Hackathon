'use strict';

import { existsSync, readFileSync } from 'fs';
import { organisationPath, green } from '../Utils/NetworkConstants.js';
import errors from './Errors.js';
const buildCCPOrg = (orgName) => { 
	// load the common connection configuration file
	const ccpPath = organisationPath(orgName);
	const fileExists = existsSync(ccpPath);
	if (!fileExists) {
		console.error("CCP configuration file not found");
		throw errors.invalid_host.withDetails('Make sure your organisation is enrolled and added into the network, then try again');
	}
	const contents = readFileSync(ccpPath, 'utf8');
	const ccp = JSON.parse(contents);
	console.log(`${green}Loaded the blockchain network configuration located at ${ccpPath}`);
	return ccp;
};

const buildWallet = async (Wallets, walletPath) => {
	// Create a new  wallet : Note that wallet is for managing identities.
	let wallet;
	if (walletPath) {
		wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Built a file system wallet at ${walletPath}`);
	} else {
		wallet = await Wallets.newInMemoryWallet();
		console.log('Built an in memory wallet');
	}
	return wallet;
};

const prettyJSONString = (inputString) => inputString? JSON.stringify(JSON.parse(inputString), null, 2): inputString;

export {buildCCPOrg, buildWallet, prettyJSONString};

