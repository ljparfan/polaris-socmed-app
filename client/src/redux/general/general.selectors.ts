import { createSelector } from "reselect";
import { RootState } from "../store";

const selectGeneral = (state: RootState) => state.general;

export const selectAlert = createSelector(
  [selectGeneral],
  (general) => general.alert
);

export const selectDialog = createSelector(
  [selectGeneral],
  (general) => general.dialog
);

export const selectSearchPanelVisibility = createSelector(
  [selectGeneral],
  (general) => general.searchPanelVisible
);

export const selectFullSizeSearchboxVisibility = createSelector(
  [selectGeneral],
  (general) => general.fullSizeSearchBarVisible
);

export const selectDarkThemeEnabled = createSelector(
  [selectGeneral],
  (general) => general.darkTheme
);

export const selectIsFullSizedPhotoViewerOpen = createSelector(
  [selectGeneral],
  (general) => general.fullSizePhotoViewer.visible
);

export const selectFullSizedPhotoViewerImageUrl = createSelector(
  [selectGeneral],
  (general) => general.fullSizePhotoViewer.imageUrl
);
