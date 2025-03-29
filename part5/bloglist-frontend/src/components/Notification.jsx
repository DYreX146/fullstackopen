import { useNotificationValue } from "../providers/NotificationContext";

const Notification = () => {
  const notification = useNotificationValue();

  if (notification === null) {
    return null;
  }

  const { message, isError } = notification;
  const alertType = isError ? "alert-danger" : "alert-success";

  return (
    <div className={`alert ${alertType} mt-3`} role="alert">
      {message}
    </div>
  );
};

export default Notification;
