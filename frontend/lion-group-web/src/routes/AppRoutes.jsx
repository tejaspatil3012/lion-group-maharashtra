import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AdminLayout } from "../layouts/AdminLayout";

// Public Pages
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { LeadershipPage } from "../pages/LeadershipPage";
import { MembersPage } from "../pages/MembersPage";
import { ActivitiesPage } from "../pages/ActivitiesPage";
import { ActivityDetailPage } from "../pages/ActivityDetailPage";
import { EventsPage } from "../pages/EventsPage";
import { EventDetailPage } from "../pages/EventDetailPage";
import { GalleryPage } from "../pages/GalleryPage";
import { AlbumDetailPage } from "../pages/AlbumDetailPage";
import { ContactPage } from "../pages/ContactPage";
import { NotFoundPage } from "../pages/NotFoundPage";

// Admin Pages
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { AdminMembersPage } from "../pages/admin/AdminMembersPage";
import { AdminEventsPage } from "../pages/admin/AdminEventsPage";
import { AdminActivitiesPage } from "../pages/admin/AdminActivitiesPage";
import { AdminGalleryPage } from "../pages/admin/AdminGalleryPage";
import { AdminSettingsPage } from "../pages/admin/AdminSettingsPage";
import { AdminInquiriesPage } from "../pages/admin/AdminInquiriesPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/leadership" element={<LeadershipPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/activities/:id" element={<ActivityDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/:id" element={<AlbumDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Portal Pages */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="members" element={<AdminMembersPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="activities" element={<AdminActivitiesPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="inquiries" element={<AdminInquiriesPage />} />
      </Route>
    </Routes>
  );
};
