import api from "./api";

export const membershipService = {
  // Public: Submit Membership Application
  submitApplication: async (applicationData) => {
    const res = await api.post("/membershipapplications", applicationData);
    return res?.data !== undefined ? res.data : res;
  },

  // Admin: Get All Applications (Optional status filter: "Pending", "Approved", "Rejected")
  getAllApplications: async (status = null) => {
    const params = status ? { status } : {};
    const res = await api.get("/membershipapplications", { params });
    return res?.data !== undefined ? res.data : res;
  },

  // Admin: Get Single Application
  getApplicationById: async (id) => {
    const res = await api.get(`/membershipapplications/${id}`);
    return res?.data !== undefined ? res.data : res;
  },

  // Admin: Approve Application (creates Member record)
  approveApplication: async (id, approveData) => {
    const res = await api.post(`/membershipapplications/${id}/approve`, approveData);
    return res?.data !== undefined ? res.data : res;
  },

  // Admin: Reject Application
  rejectApplication: async (id) => {
    const res = await api.post(`/membershipapplications/${id}/reject`);
    return res?.data !== undefined ? res.data : res;
  },

  // Admin: Delete Application
  deleteApplication: async (id) => {
    const res = await api.delete(`/membershipapplications/${id}`);
    return res?.data !== undefined ? res.data : res;
  }
};
