import api from "./api";

export const galleryService = {
  getAlbums: async () => {
    const res = await api.get("/gallery");
    return res.data !== undefined ? res.data : res;
  },
  getAlbumById: async (id) => {
    const res = await api.get(`/gallery/${id}`);
    return res.data !== undefined ? res.data : res;
  },
  getRecentImages: async (count = 6) => {
    const res = await api.get("/gallery/recent", { params: { count } });
    return res.data !== undefined ? res.data : res;
  }
};
