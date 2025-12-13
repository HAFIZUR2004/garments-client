import axios from "axios";

const useAxiosSecure = () => {
  const instance = axios.create({
    baseURL: "http://localhost:5000",
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // token নাও
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return instance;
};

export default useAxiosSecure;
