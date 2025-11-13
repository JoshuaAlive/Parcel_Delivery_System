import axios from "axios";
const BASE_URL="http://localhost:8500/api/v1/";

const publicRequest = axios.create({
    baseURL: BASE_URL,
  });
  export { publicRequest };