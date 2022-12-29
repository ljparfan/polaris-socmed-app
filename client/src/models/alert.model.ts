import { AlertType } from "./alert-type.model";

export interface Alert {
  type: AlertType;
  message: string;
  visible?: boolean;
  durationInMs?: number;
}
