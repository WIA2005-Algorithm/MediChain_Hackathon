import mongoose from 'mongoose';
const { Schema } = mongoose;

const Organizations = mongoose.model(
    "Organizations", new Schema({
        Name: {type: String, required: [true, 'Organization name is required'], trim: true},
        AdminID: {type: String, required: [true, "Admin username is required"], trim: true}
    },
    {timestamps: true}));