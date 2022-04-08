"use-strict";
import mongoose from "mongoose";
const { Schema } = mongoose;

export const System_logs = mongoose.model(
    "System_logs",
    new Schema(
        {
            Title: {
                type: String,
                trim: true,
            },
            Subtitle: {
                type: String,
                trim: true,
            },
            Details: {
                type: String,
                trim: true,
            },
            Icon: {
                type: String,
                trim: true,
                default: "info",
            },
            User: {
                type: String,
                index: true,
                trim: true,
            },
        },
        { timestamps: true }
    )
);

export const log = async (User, Title, Subtitle, Icon = "info") => {
    await System_logs.create({ Title, Subtitle, Icon, User });
};
