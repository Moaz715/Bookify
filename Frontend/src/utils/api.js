import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
}

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
})


api.interceptors.response.use(
    (response) => { return response },

    async (error) => {
        const originalReq = error.config;

        if (error.response.status === 401 && !originalReq.retry && originalReq.url !== '/api/users/refresh') {
            originalReq.retry = true;
            try {
                const res = await axios.post('http://localhost:5000/api/users/refresh', {}, { withCredentials: true });

                setAccessToken(res.data.accessToken);

                originalReq.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return api(originalReq);

            }catch(err){
                setAccessToken(null);
                toast.error("Your session has expired. Please log in again.");
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;