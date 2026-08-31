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
  },
  createAlbum: async (data) => {
    const res = await api.post("/gallery", data);
    return res.data !== undefined ? res.data : res;
  },
  updateAlbum: async (id, data) => {
    const res = await api.put(`/gallery/${id}`, data);
    return res.data !== undefined ? res.data : res;
  },
  deleteAlbum: async (id) => {
    const res = await api.delete(`/gallery/${id}`);
    return res.data !== undefined ? res.data : res;
  },
  addImageToAlbum: async (albumId, data) => {
    const res = await api.post(`/gallery/${albumId}/images`, data);
    return res.data !== undefined ? res.data : res;
  },
  deleteImage: async (imageId) => {
    const res = await api.delete(`/gallery/images/${imageId}`);
    return res.data !== undefined ? res.data : res;
  }
};
