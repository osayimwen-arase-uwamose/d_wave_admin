import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

import LoginPage from "../pages/LoginPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import EventPage from "../pages/EventPage.jsx";
import EventsPage from "../pages/EventsPage.jsx";
import CreateEventPage from "../pages/CreateEventPage.jsx";
import AddGalleryPhotoPage from "../pages/AddGalleryPhotoPage.jsx";
import UpdateEventPage from "../pages/UpdateEventPage.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
      
        <Route 
          path='/' 
          element={<LoginPage />} 
        />

      </Route>

      <Route element={<ProtectedRoute />}>

          {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <DashboardPage />
          }
        />

        <Route 
         path="/dashboard/events" 
         element={<EventsPage />}
        />

        <Route 
          path="/dashboard/events/:eventId/gallery/add"
          element={<AddGalleryPhotoPage />}
        /> 

        <Route 
          path="/dashboard/create-event"
          element={<CreateEventPage />}
        />

        <Route 
          path="/dashboard/events/:eventId/edit"
          element={<UpdateEventPage />}
        />

          {/* EVENT ROUTES */}
        <Route 
          path="/events/:eventId"
          element={<EventPage />}
        />

      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;
