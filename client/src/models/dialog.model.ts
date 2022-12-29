import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export interface Dialog {
  visible: boolean;
  title: string;
  body: string;
  actionToBeFired?: { type: string; payload: any };
  actionButton?: DialogActionButton | null;
}

interface DialogActionButton {
  type: "error" | "success" | "info" | "warn";
  text: string;
}
