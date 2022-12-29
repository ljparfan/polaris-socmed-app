import { createReducer } from "@reduxjs/toolkit";
import {
  closeDialog,
  closeFullSizePhotoViewer,
  hideAlert,
  hideFullSizeSearchbox,
  hideSearchResultsPanel,
  openDialog,
  openFullSizePhotoViewer,
  setDarkThemeEnabled,
  showAlert,
  showFullSizeSearchbox,
  showSearchResultsPanel,
  toggleDarkTheme,
} from "./general.actions";
import { initialGeneralState } from "./general.state";

const generalReducer = createReducer(initialGeneralState, (builder) =>
  builder
    .addCase(showAlert, (state, action) => {
      state.alert = {
        ...action.payload,
        visible: true,
      };
    })
    .addCase(hideAlert, (state, _action) => {
      state.alert = {
        ...state.alert,
        visible: false,
      };
    })
    .addCase(openDialog, (state, action) => {
      state.dialog = {
        ...action.payload,
        visible: true,
      };
    })
    .addCase(closeDialog, (state, _action) => {
      state.dialog = {
        ...state.dialog,
        visible: false,
      };
    })
    .addCase(openFullSizePhotoViewer, (state, action) => {
      state.fullSizePhotoViewer = {
        imageUrl: action.payload,
        visible: true,
      };
    })
    .addCase(closeFullSizePhotoViewer, (state, _action) => {
      state.fullSizePhotoViewer = {
        ...state.fullSizePhotoViewer,
        visible: false,
      };
    })
    .addCase(showFullSizeSearchbox, (state, _action) => {
      state.fullSizeSearchBarVisible = true;
    })
    .addCase(hideFullSizeSearchbox, (state, _action) => {
      state.fullSizeSearchBarVisible = false;
    })
    .addCase(showSearchResultsPanel, (state, _action) => {
      state.searchPanelVisible = true;
    })
    .addCase(hideSearchResultsPanel, (state, _action) => {
      state.searchPanelVisible = false;
    })
    .addCase(toggleDarkTheme, (state, _action) => {
      state.darkTheme = !state.darkTheme;
    })
    .addCase(setDarkThemeEnabled, (state, action) => {
      state.darkTheme = action.payload;
    })
);

export default generalReducer;
