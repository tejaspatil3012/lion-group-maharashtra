import api from "./api";

export const authService = {
  login: async (username, password) => {
    const res = await api.post("/auth/login", {
      username: username || "admin",
      password: password
    });
    const data = res?.data !== undefined ? res.data : res;
    const token = data?.token;
    if (token) {
      localStorage.setItem("lion_admin_token", token);
      localStorage.setItem("lion_admin_auth", "true");
      localStorage.setItem("lion_admin_user", data.username || "admin");

      sessionStorage.setItem("lion_admin_token", token);
      sessionStorage.setItem("lion_admin_auth", "true");
      sessionStorage.setItem("lion_admin_user", data.username || "admin");
    }
    return data;
  },

  verifyToken: async () => {
    try {
      const res = await api.get("/auth/verify");
      return res?.data !== undefined ? res.data : res;
    } catch {
      authService.logout();
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem("lion_admin_token");
    localStorage.removeItem("lion_admin_auth");
    localStorage.removeItem("lion_admin_user");

    sessionStorage.removeItem("lion_admin_token");
    sessionStorage.removeItem("lion_admin_auth");
    sessionStorage.removeItem("lion_admin_user");
  },

  isAuthenticated: () => {
    return Boolean(
      localStorage.getItem("lion_admin_token") || 
      sessionStorage.getItem("lion_admin_token")
    );
  }
};

export default authService;
