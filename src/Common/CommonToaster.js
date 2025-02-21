import React from "react";
import { notification } from "antd";

export const CommonToaster = (description) => {
  notification.open({
    //   message: 'Notification Title',
    description: description,
    showProgress: true,
    pauseOnHover: true,
    duration: 1.5,
    placement: "topRight",
  });
};
