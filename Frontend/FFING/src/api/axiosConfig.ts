import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_SERVER_ENDPOINT;

export default axios;
