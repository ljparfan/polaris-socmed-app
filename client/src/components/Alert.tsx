import { ReactNode } from "react";
import { AlertType } from "../models/alert-type.model";

type Props = {
  type: AlertType;
  children: ReactNode;
};

const ALERT_MAP: { [key: string]: string } = {
  error: "bg-red-100 border-l-4 border-red-600 text-red-800 p-4",
  warning: "bg-orange-100 border-l-4 border-orange-600 text-orange-800 p-4",
  info: "bg-blue-100 border-l-4 border-blue-600 text-blue-800 p-4",
  success: "bg-green-100 border-l-4 border-green-600 text-green-800 p-4",
};

const Alert = ({ type, children }: Props) => {
  return (
    <div className={ALERT_MAP[type]} role="alert">
      <span className="font-semibold text-sm">{children}</span>
    </div>
  );
};

export default Alert;
