import api from "./api";

export const aboutService = {
  getAboutData: async () => {
    const res = await api.get("/about");
    return res.data !== undefined ? res.data : res;
  },
  updateAboutData: async (data) => {
    const res = await api.put("/about", data);
    return res.data !== undefined ? res.data : res;
  }
};
