// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Clubs from './pages/Clubs';
import JaipurEvents from './pages/JaipurEvents';
import Events from './pages/Events';
import EventDetails from './components/EventDetails';
import EventRegistration from './pages/EventRegistration';

import ContactPage from './pages/ContactPage';
import StudentDashboard from './pages/StudentDashboard';
import DashboardRouter from './pages/DashboardRouter';
import Dashboard from './pages/Dashboard';
import ClubDashboard from './pages/ClubDashboard';

import Leaderboard from './pages/Leaderboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import StudentCalendar from './pages/StudentCalendar';
import ProfileSettings from './pages/ProfileSettings';
import CreateEvent from './pages/CreateEvent';
import ManageStudents from "./pages/ManageStudents";

import JoinCommunity from './pages/JoinCommunity';
import ClubMemberJoin from './pages/ClubMemberJoin';
import ClubTeamApply from './pages/ClubTeamApply';

import SignUp from "./components/Auth/SignUp";
import LoginPage from "./components/Auth/LoginPage";
import RoleProtectedRoute from "./components/Auth/RoleProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/jaipur" element={<JaipurEvents />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Registration */}
        <Route path="/register/:eventId" element={<EventRegistration />} />

        {/* Auth */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route
          path="/student-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["student", "admin"]}>
              <StudentDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "admin"]}>
              <Dashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/club-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["club", "admin"]}>
              <ClubDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* Teacher Tools */}
        <Route
          path="/manage-students"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "club", "admin"]}>
              <ManageStudents />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "club", "admin"]}>
              <AnalyticsDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <RoleProtectedRoute allowedRoles={["club", "admin"]}>
              <CreateEvent />
            </RoleProtectedRoute>
          }
        />

        {/* Student Tools */}
        <Route
          path="/my-calendar"
          element={
            <RoleProtectedRoute allowedRoles={["student", "teacher", "club", "admin"]}>
              <StudentCalendar />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <RoleProtectedRoute allowedRoles={["student"]}>
              <Leaderboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <RoleProtectedRoute allowedRoles={["student", "teacher", "club", "admin"]}>
              <ProfileSettings />
            </RoleProtectedRoute>
          }
        />

        {/* Community */}
        <Route path="/join-community" element={<JoinCommunity />} />
        <Route path="/club-member-join" element={<ClubMemberJoin />} />
        <Route path="/club-team-apply" element={<ClubTeamApply />} />

        {/* Contact */}
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
