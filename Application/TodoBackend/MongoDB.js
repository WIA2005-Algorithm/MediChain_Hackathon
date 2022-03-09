
'use strict'
import { dbURI } from './server_config.js';
import mongoose from 'mongoose';
export const MongoDB = async () => {
	try {
		console.log(dbURI);
		await mongoose.connect(`${dbURI}`, {
		useNewUrlParser: true,
        	useUnifiedTopology: true,
	});
	console.log('MongoDB Database connected successfully');
	} catch (error) {
	console.log(error.message);
	process.exit(1);
	}
};

