import api from "./api";

export const contactService = {
  getContactInfo: async () => {
    const res = await api.get("/contact");
    return res.data;
  },
  submitInquiry: async (formData) => {
    const res = await api.post("/contact", formData);
    return res;
  }
};
