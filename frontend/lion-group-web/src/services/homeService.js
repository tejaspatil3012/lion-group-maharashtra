import api from "./api";

export const homeService = {
  getHomeData: async () => {
    const res = await api.get("/home");
    return res.data;
  }
};
