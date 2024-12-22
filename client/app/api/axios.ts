import axios from "axios";
// const BASE_URL = "https://maxbrain.vercel.app/api/v1";
const BASE_URL = "http://localhost:5000/api/v1";

export default axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
    }
});