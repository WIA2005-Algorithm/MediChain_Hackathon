"use-strict";
import mongoose from "mongoose";
const { Schema } = mongoose;
export const Notification = mongoose.model(
  "Notifications",
  new Schema(
    {
      //Org#Role#ID
      To: {
        type: String,
        required: [true, "To field cannot be empty"],
        trim: true,
        index: true,
        unique: false
      },
      //Org#Role#Name
      From: {
        type: String,
        required: [true, "From field cannot be empty"],
        trim: true,
        index: true,
        unique: false
      },
      // Notification string itself
      NotificationString: {
        type: String,
        required: true,
        trim: true
      },
      // String to accept, null for nothing
      NotificationAccept: {
        type: String,
        required: true,
        trim: true
      },
      // String to deny, null for nothing
      NotificationDeny: {
        type: String,
        required: true,
        trim: true
      },
      Read: {
        type: Boolean,
        default: false
      },
      // JSON.stringyfy before storing it and JSON.parse to access it
      Data: {
        type: String,
        required: false,
        trim: true
      }
    },
    { timestamps: true }
  )
);

export const RequestModel = mongoose.model(
  "RequestModel",
  new Schema(
    {
      //Org#Role#ID
      RID: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: false
      },
      //Active or null (declined)
      Status: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: false
      },
      // Comment
      CommentToAccessOrDeny: {
        type: String,
        required: true,
        trim: true
      },
      Note: {
        type: String,
        required: false,
        trim: true
      },
      // Stringy JSON then parse it to access --> {docID : EMRID, docID : EMRID}
      EMRRequested: {
        type: String,
        required: false,
        trim: true,
        default: JSON.stringify([])
      },
      // Stringy JSON then parse it to access --> {docID : EMRID, docID : EMRID}
      EMRAccepted: {
        type: String,
        required: false,
        trim: true,
        default: JSON.stringify([])
      },
      // JSON.stringyfy before storing it and JSON.parse to access it
      Data: {
        type: String,
        required: false,
        trim: true
      }
    },
    { timestamps: true }
  )
);
