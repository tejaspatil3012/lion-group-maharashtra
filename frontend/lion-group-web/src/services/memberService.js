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
  },
  getAllDesignations: async () => {
    const res = await api.get("/members/designations");
    return res.data !== undefined ? res.data : res;
  },
  createMember: async (data) => {
    const res = await api.post("/members", data);
    return res.data !== undefined ? res.data : res;
  },
  updateMember: async (id, data) => {
    const res = await api.put(`/members/${id}`, data);
    return res.data !== undefined ? res.data : res;
  },
  deleteMember: async (id) => {
    const res = await api.delete(`/members/${id}`);
    return res.data !== undefined ? res.data : res;
  },
  createDesignation: async (data) => {
    const res = await api.post("/members/designations", data);
    return res.data !== undefined ? res.data : res;
  }
};
