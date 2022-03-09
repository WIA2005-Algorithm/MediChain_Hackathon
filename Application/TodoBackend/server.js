'use strict'
import express, { json } from 'express';
import cors from 'cors';
import { port, url } from './server_config.js';
import {MongoDB} from "./MongoDB.js";
import enrollRoute from './routes/userAuth.js';
const app = express();
app.use(cors());
app.use(json());
// Connect to the database
// Connect to the database
MongoDB();
// Start the server
app.use('/api/users', enrollRoute);
app.listen(port, ()=>{
    console.log(`Server is running on ${url}`);
});
