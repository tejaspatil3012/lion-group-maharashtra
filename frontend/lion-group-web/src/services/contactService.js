import api from "./api";

export const contactService = {
  getContactInfo: async () => {
    const res = await api.get("/contact");
    return res.data !== undefined ? res.data : res;
  },
  submitInquiry: async (data) => {
    const res = await api.post("/contact", data);
    return res.data !== undefined ? res.data : res;
  },
  getAllInquiries: async () => {
    const res = await api.get("/contact/inquiries");
    return res.data !== undefined ? res.data : res;
  },
  deleteInquiry: async (id) => {
    const res = await api.delete(`/contact/inquiries/${id}`);
    return res.data !== undefined ? res.data : res;
  }
};
