import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import ListingWizard from '../components/ListingWizard.jsx';
import { useToast } from '../components/Toast.jsx';
import SEO from '../components/SEO.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { Icon } from '../components/Icon.jsx';

export default function EditListingPage() {
  return (
    <ProtectedRoute role="owner">
      <EditListing />
    </ProtectedRoute>
  );
}

function EditListing() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const toast    = useToast();

  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    setLoading(true); setError('');
    api.get(`/rooms/${id}`)
      .then(({ data }) => setInitial(data.room || data))
      .catch(() => setError('Could not load this listing.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (payload) => {
    try {
      await api.put(`/rooms/${id}`, payload);
      toast.success('Listing updated successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
      throw err;
    }
  };

  return (
    <>
      <SEO title="Edit listing" description="Edit your BASERA room listing." />
      <div className="page-container">
        <div className="max-w-3xl mx-auto mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-ghost text-sm -ml-3 mb-4"
            type="button"
          >
            <Icon name="arrowLeft" className="w-4 h-4" /> Back to dashboard
          </button>
          <p className="text-xs font-semibold text-ink-mute uppercase tracking-wider">Edit listing</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
            Update room details
          </h1>
          <p className="text-ink-mute mt-2 text-sm">All fields are pre-filled with your current data.</p>
        </div>

        {loading ? (
          <div className="max-w-3xl mx-auto card p-8 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto card p-8 text-center">
            <p className="text-ink-mute">{error}</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">
              Back to dashboard
            </button>
          </div>
        ) : initial ? (
          <ListingWizard
            initial={initial}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard')}
            submitLabel="Save changes"
            busyLabel="Saving…"
          />
        ) : null}
      </div>
    </>
  );
}
