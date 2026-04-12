import axios from "axios";
import { store } from "../../store";
import { errorMessageToast } from "../../components/common/hooks/common";
import { clearUser } from "../../store/slices/authSlice";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
console.log("baseUrl", baseUrl);
const axiosInstance = axios.create({
  baseURL: `${baseUrl}/v1`,
  
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      errorMessageToast(error?.response?.data?.message || error?.message, {
        toastId: "error",
      });
      if (error.response?.status === 401) {
        store.dispatch(clearUser());
      }
      // if (error.response?.status === 403) {
      //   window.location.reload();
      //   window.location.href = "/dashboard";
      // }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;