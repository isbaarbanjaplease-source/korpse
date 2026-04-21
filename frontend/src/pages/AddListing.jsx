import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import ListingWizard from '../components/ListingWizard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import SEO from '../components/SEO.jsx';

export default function AddListingPage() {
  return (
    <ProtectedRoute role="owner">
      <AddListing />
    </ProtectedRoute>
  );
}

function AddListing() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const toast     = useToast();

  const initial = {
    ownerName:  user?.name  || '',
    ownerPhone: user?.phone || '',
  };

  const handleSubmit = async (payload) => {
    try {
      await api.post('/rooms', payload);
      toast.success('Listing published! Seekers can find it now.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not publish listing.');
      throw err;
    }
  };

  return (
    <>
      <SEO title="List a room" description="Publish a new room listing on BASERA." />
      <div className="page-container">
        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-xs font-semibold text-ink-mute uppercase tracking-wider">New listing</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">List your room</h1>
          <p className="text-ink-mute mt-2 text-sm">
            Five short steps. Free. Edits and removals are always one tap away.
          </p>
        </div>
        <ListingWizard
          initial={initial}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard')}
          submitLabel="Publish listing"
          busyLabel="Publishing…"
        />
      </div>
    </>
  );
}
