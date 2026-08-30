import api from "./api";

export const memberService = {
  getAllMembers: async (params = {}) => {
    const res = await api.get("/members", { params });
    return res.data !== undefined ? res.data : res;
  },
  getMemberById: async (id) => {
    const res = await api.get(`/members/${id}`);
    return res.data !== undefined ? res.data : res;
  },
  getLeadership: async () => {
    const res = await api.get("/members/leadership");
    return res.data !== undefined ? res.data : res;
  },
  getDesignations: async () => {
    const res = await api.get("/members/designations");
    return res.data !== undefined ? res.data : res;
  }
};
