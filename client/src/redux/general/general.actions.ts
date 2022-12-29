import { createAction } from "@reduxjs/toolkit";
import { Alert } from "../../models/alert.model";
import { Dialog } from "../../models/dialog.model";
import { GeneralTypes } from "./general.types";

export const showAlert = createAction<Alert, GeneralTypes.SHOW_ALERT>(
  GeneralTypes.SHOW_ALERT
);

export const hideAlert = createAction<void, GeneralTypes.HIDE_ALERT>(
  GeneralTypes.HIDE_ALERT
);

export const showFullSizeSearchbox = createAction<
  void,
  GeneralTypes.SHOW_FULL_SIZE_SEARCHBOX
>(GeneralTypes.SHOW_FULL_SIZE_SEARCHBOX);

export const hideFullSizeSearchbox = createAction<
  void,
  GeneralTypes.HIDE_FULL_SIZE_SEARCHBOX
>(GeneralTypes.HIDE_FULL_SIZE_SEARCHBOX);

export const showSearchResultsPanel = createAction<
  void,
  GeneralTypes.SHOW_SEARCH_PANEL
>(GeneralTypes.SHOW_SEARCH_PANEL);

export const hideSearchResultsPanel = createAction<
  void,
  GeneralTypes.HIDE_SEARCH_PANEL
>(GeneralTypes.HIDE_SEARCH_PANEL);

export const openDialog = createAction<Dialog, GeneralTypes.OPEN_DIALOG>(
  GeneralTypes.OPEN_DIALOG
);

export const closeDialog = createAction<
  { type: string; payload: any } | undefined,
  GeneralTypes.CLOSE_DIALOG
>(GeneralTypes.CLOSE_DIALOG);

export const openFullSizePhotoViewer = createAction<
  string,
  GeneralTypes.OPEN_FULL_SIZE_PHOTO_VIEWER
>(GeneralTypes.OPEN_FULL_SIZE_PHOTO_VIEWER);

export const closeFullSizePhotoViewer = createAction<
  void,
  GeneralTypes.CLOSE_FULL_SIZE_PHOTO_VIEWER
>(GeneralTypes.CLOSE_FULL_SIZE_PHOTO_VIEWER);

export const toggleDarkTheme = createAction<
  void,
  GeneralTypes.TOGGLE_DARK_THEME
>(GeneralTypes.TOGGLE_DARK_THEME);

export const setDarkThemeEnabled = createAction<
  boolean,
  GeneralTypes.SET_DARK_THEME_ENABLED
>(GeneralTypes.SET_DARK_THEME_ENABLED);
