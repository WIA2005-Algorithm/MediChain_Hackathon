// Configuration file for express server port & Firebase Database
'use strict'
import assert from 'assert';
import dotenv from "dotenv";
dotenv.config();

const {
    PORT,
    HOST,
    HOST_URL,
    DATABASE_URI
} = process.env;

assert(PORT, 'Port is required');
assert(HOST, 'Host is required');
assert(DATABASE_URI, 'Database URI is required');
export const port = PORT;
export const host = HOST;
export const url = HOST_URL;
export const dbURI = DATABASE_URI;
