import api from "./api";

const unwrap = (res) => (res && res.data !== undefined ? res.data : res);

export const donationService = {
  // Public
  getActiveCampaigns: async () => {
    const res = await api.get("/donations/campaigns");
    return unwrap(res);
  },

  getCampaignById: async (id) => {
    const res = await api.get(`/donations/campaigns/${id}`);
    return unwrap(res);
  },

  getRecentDonors: async (count = 50) => {
    const res = await api.get(`/donations/recent-donors?count=${count}`);
    return unwrap(res);
  },

  submitDonation: async (donationData) => {
    const res = await api.post("/donations/submit", donationData);
    return unwrap(res);
  },

  getReceipt: async (receiptNumber) => {
    const res = await api.get(`/donations/receipt/${receiptNumber}`);
    return unwrap(res);
  },

  // Admin
  getAllCampaigns: async () => {
    const res = await api.get("/donations/admin/campaigns");
    return unwrap(res);
  },

  createCampaign: async (campaignData) => {
    const res = await api.post("/donations/admin/campaigns", campaignData);
    return unwrap(res);
  },

  updateCampaign: async (id, campaignData) => {
    const res = await api.put(`/donations/admin/campaigns/${id}`, campaignData);
    return unwrap(res);
  },

  deleteCampaign: async (id) => {
    const res = await api.delete(`/donations/admin/campaigns/${id}`);
    return unwrap(res);
  },

  getDonationsList: async (status = null, campaignId = null, search = "") => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (campaignId) params.append("campaignId", campaignId);
    if (search) params.append("search", search);
    const res = await api.get(`/donations/admin/donations?${params.toString()}`);
    return unwrap(res);
  },

  verifyDonation: async (id, status, adminNote = "") => {
    const res = await api.post(`/donations/admin/donations/${id}/verify`, {
      status,
      adminNote
    });
    return unwrap(res);
  },

  getStats: async () => {
    const res = await api.get("/donations/admin/stats");
    return unwrap(res);
  }
};
