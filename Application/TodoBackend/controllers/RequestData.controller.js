import { Notification, RequestModel } from "../models/NotificationModel.js";
import { log } from "../models/Utilities.model.js";

export const CreateRequestModelObject = async (model) => {
  const reqModel = await RequestModel.create(model);
  console.log("\n>> Created A Request Successfully:\n", reqModel);
  log(
    "Doctor",
    "Network Creation",
    `A new request to access external patient data was successfully created [${reqModel.RID}]`,
    "add"
  );
};

export const CreateNotificationModelObject = async (model) => {
  const reqModel = await Notification.create(model);
  console.log("\n>> Created A Notification Successfully:\n", reqModel);
};
