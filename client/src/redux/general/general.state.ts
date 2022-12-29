import { Alert } from "../../models/alert.model";
import { Dialog } from "../../models/dialog.model";

// Define a type for the slice state
export interface GeneralState {
  alert: Alert;
  dialog: Dialog;
  fullSizePhotoViewer: {
    imageUrl: string;
    visible: boolean;
  };
  fullSizeSearchBarVisible: boolean;
  searchPanelVisible: boolean;
  darkTheme: boolean;
}

// Define the initial state using that type
export const initialGeneralState: GeneralState = {
  alert: {
    type: "error",
    message: "",
    visible: false,
    durationInMs: 5000,
  },
  dialog: {
    visible: false,
    body: "",
    actionButton: null,
    title: "",
  },
  fullSizeSearchBarVisible: false,
  searchPanelVisible: false,
  darkTheme: false,
  fullSizePhotoViewer: {
    imageUrl: "",
    visible: false,
  },
};
