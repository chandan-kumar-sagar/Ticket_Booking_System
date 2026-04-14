import API from "./api";

// --- User Authentication ---
export const userSignup = (userData) => {
  return API.post("/api/v1/user/user/signup", userData);
};

export const userLogin = (credentials) => {
  return API.post("/api/v1/user/login", credentials);
};

// --- Admin Authentication ---
export const adminSignup = (adminData) => {
  return API.post("/api/v1/Admin/admin/signup", adminData);
};

export const adminLogin = (credentials) => {
  return API.post("/api/v1/Admin/login", credentials);
};
