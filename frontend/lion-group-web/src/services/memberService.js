import api from "./api";

export const memberService = {
  getAllMembers: async (params = {}) => {
    const res = await api.get("/members", { params });
    return res.data;
  },
  getMemberById: async (id) => {
    const res = await api.get(`/members/${id}`);
    return res.data;
  },
  getLeadership: async () => {
    const res = await api.get("/members/leadership");
    return res.data;
  },
  getDesignations: async () => {
    const res = await api.get("/members/designations");
    return res.data;
  }
};
