import api from "./api";

export const eventService = {
  getEvents: async (params = {}) => {
    const res = await api.get("/events", { params });
    return res.data !== undefined ? res.data : res;
  },
  getUpcomingEvents: async (count = 3) => {
    const res = await api.get("/events/upcoming", { params: { count } });
    return res.data !== undefined ? res.data : res;
  },
  getEventById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data !== undefined ? res.data : res;
  }
};
