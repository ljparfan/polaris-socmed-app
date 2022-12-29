import axios, { AxiosError } from "axios";

export type HttpError = AxiosError;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  // dev code
  axios.defaults.baseURL = "http://localhost:4000/api";
} else {
  axios.defaults.baseURL = "https://boiling-mountain-23729.herokuapp.com/api";
  // production code
}
const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
  interceptors: axios.interceptors,
};

export default http;
