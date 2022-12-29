import { all, call, takeLatest } from "redux-saga/effects";
import { showAlert } from "./general.actions";
import * as toastService from "../../services/toast.service";

function* openToast({ payload: alert }: ReturnType<typeof showAlert>) {
  yield toastService.openToast(alert);
}

function* onShowAlert() {
  yield takeLatest(showAlert.type, openToast);
}

export function* generalSagas() {
  yield all([call(onShowAlert)]);
}
