import axios from "axios";

const authenticatedApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || BASE_API_URL,
});

// authenticatedApi.interceptors.request.use(
//   async (config) => {
//     const token = await getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     // console.log("API called!", config);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default authenticatedApi;

export const getAxiosErrorMessage = (error) => {
  // 1. Server responded with an error
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    console.log(data);

    if (data && typeof data.errors === "object" && data.errors !== null) {
      const errorMessages = Object.values(data.errors);

      if (errorMessages.length > 0) {
        return errorMessages.join("\n"); // Returns each error on a new line
      }
    }

    if (data && typeof data.message === "string") {
      return data.message;
    }
    if (data && typeof data.error === "string") {
      return data.error;
    }

    // If no specific message is found, use a generic message based on the status code.
    switch (status) {
      case 400:
        return "Bad Request. Please check the data you sent.";
      case 401:
        return "You are not authorized. Please log in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 500:
      case 502:
      case 503:
        return "There was a problem with the server. Please try again later.";
      default:
        return `Request failed with status code ${status}.`;
    }
  }

  // 2. Network error (no response received)
  else if (error.request) {
    return "Network Error. Please check your internet connection.";
  }

  // 3. Other errors (e.g., setting up the request)
  else {
    return error.message || "An unexpected error occurred.";
  }
};
