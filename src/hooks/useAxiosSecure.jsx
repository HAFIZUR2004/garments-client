import axios from "axios";

const useAxiosSecure = () => {
  const instance = axios.create({
    baseURL: "http://localhost:5000",
  });

  // Attach token to every request
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No token found in localStorage");
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Optional: handle 401/403 globally
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.error("Unauthorized access – check your token or role");
        // You could logout the user or redirect here
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxiosSecure;
