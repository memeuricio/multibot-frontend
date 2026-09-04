import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = apiUrl;

axios.defaults.withCredentials = true;

const axiosConfig = axios.create();

export default axiosConfig;