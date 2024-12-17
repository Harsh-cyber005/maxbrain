import axios from "axios";
const BASE_URL = "https://maxbrain.vercel.app/api/v1";

export default axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
    }
});