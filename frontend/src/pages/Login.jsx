import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Spinner from '../components/Spinner.jsx';
import SEO from '../components/SEO.jsx';
import { Icon } from '../components/Icon.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const toast     = useToast();
  const from      = location.state?.from?.pathname || '/';

  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user?.name?.split(' ')[0] || 'there'}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Sign in" description="Sign in to your BASERA account." />
      <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <div className="card p-8 sm:p-10">
            <div className="mb-8">
              <Link to="/" className="inline-flex items-baseline gap-1 font-display font-extrabold text-lg text-ink">
                BASERA
                <span className="w-1.5 h-1.5 rounded-full bg-accent-600" />
              </Link>
              <h1 className="font-display text-2xl font-bold text-ink mt-6">Welcome back</h1>
              <p className="text-sm text-ink-mute mt-1.5">Sign in to manage rooms and bookmarks.</p>
            </div>

            {error && (
              <div className="card border-red-200 bg-red-50 text-red-700 px-3.5 py-2.5 mb-5 flex items-center gap-2 text-sm">
                <Icon name="alert" className="w-4 h-4" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="float-field">
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder=" "
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  data-testid="login-email"
                />
                <label htmlFor="login-email">Email address</label>
              </div>

              <div className="float-field">
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  placeholder=" "
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  data-testid="login-password"
                />
                <label htmlFor="login-password">Password</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-1"
                data-testid="login-submit"
              >
                {loading ? <Spinner label="Signing in…" /> : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-ink-mute mt-7">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent-700 hover:text-accent-800 font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
