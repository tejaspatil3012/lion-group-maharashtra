import api from "./api";

export const activityService = {
  getActivities: async (params = {}) => {
    const res = await api.get("/activities", { params });
    return res.data !== undefined ? res.data : res;
  },
  getFeaturedActivities: async (count = 3) => {
    const res = await api.get("/activities/featured", { params: { count } });
    return res.data !== undefined ? res.data : res;
  },
  getActivityById: async (id) => {
    const res = await api.get(`/activities/${id}`);
    return res.data !== undefined ? res.data : res;
  }
};
