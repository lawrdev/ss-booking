import { BASE_URL, SS_ID, SS_SECRET } from "@/helpers/env";
import axios from "axios";

// axios.defaults.headers.get["app_id"] = SS_ID;
// axios.defaults.headers.get["app_secret"] = SS_SECRET;

export default axios.create({
  baseURL: `${BASE_URL}`,
  headers: { app_id: SS_ID, app_secret: SS_SECRET },
});
