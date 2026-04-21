import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home        from './pages/Home.jsx';
import Listings    from './pages/Listings.jsx';
import RoomDetail  from './pages/RoomDetail.jsx';
import Login       from './pages/Login.jsx';
import Register    from './pages/Register.jsx';
import AddListing  from './pages/AddListing.jsx';
import Dashboard   from './pages/Dashboard.jsx';
import EditListing from './pages/EditListing.jsx';
import Saved       from './pages/Saved.jsx';
import NotFound    from './pages/NotFound.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"           element={<Home />} />
          <Route path="/listings"   element={<Listings />} />
          <Route path="/rooms/:id"  element={<RoomDetail />} />
          <Route path="/saved"      element={<Saved />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />

          {/* Owner-protected (auth handled inside the page wrappers) */}
          <Route path="/add-listing"     element={<AddListing />} />
          <Route path="/dashboard"       element={<Dashboard />} />
          <Route path="/rooms/:id/edit"  element={<EditListing />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
