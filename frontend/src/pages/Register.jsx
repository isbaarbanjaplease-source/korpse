import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Spinner from '../components/Spinner.jsx';
import SEO from '../components/SEO.jsx';
import { Icon } from '../components/Icon.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const toast        = useToast();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'seeker',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim())                       return 'Please enter your name.';
    if (!form.email.trim())                      return 'Please enter your email.';
    if (form.password.length < 6)                return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword)  return 'Passwords do not match.';
    if (!form.phone.trim())                      return 'Please enter your phone number.';
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) return 'Please enter a valid 10-digit phone number.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const data = await register(payload);
      toast.success(`Welcome to BASERA, ${data.user?.name?.split(' ')[0] || ''}!`);
      navigate(form.role === 'owner' ? '/dashboard' : '/listings', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create account" description="Join BASERA to find rooms or list your property." />

      <div className="min-h-[85vh] flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <div className="card p-8 sm:p-10">
            <div className="mb-7">
              <Link to="/" className="inline-flex items-baseline gap-1 font-display font-extrabold text-lg text-ink">
                BASERA
                <span className="w-1.5 h-1.5 rounded-full bg-accent-600" />
              </Link>
              <h1 className="font-display text-2xl font-bold text-ink mt-6">Create your account</h1>
              <p className="text-sm text-ink-mute mt-1.5">Free, takes about a minute.</p>
            </div>

            {error && (
              <div className="card border-red-200 bg-red-50 text-red-700 px-3.5 py-2.5 mb-5 flex items-center gap-2 text-sm">
                <Icon name="alert" className="w-4 h-4" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Role */}
              <div>
                <p className="label mb-2">I am a</p>
                <div className="grid grid-cols-2 gap-2.5" role="radiogroup">
                  {[
                    { v: 'seeker', label: 'Seeker',  desc: 'Looking for a room' },
                    { v: 'owner',  label: 'Owner',   desc: 'I have rooms to rent' },
                  ].map((r) => {
                    const active = form.role === r.v;
                    return (
                      <label
                        key={r.v}
                        className={`cursor-pointer card p-3.5 transition-all ${
                          active ? 'border-ink ring-1 ring-ink' : 'hover:border-ink-mute'
                        }`}
                        data-testid={`role-${r.v}`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r.v}
                          checked={active}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold ${active ? 'text-ink' : 'text-ink-soft'}`}>
                            {r.label}
                          </span>
                          {active && <Icon name="check" className="w-4 h-4 text-accent-700" />}
                        </div>
                        <p className="text-xs text-ink-mute mt-1">{r.desc}</p>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="float-field">
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  placeholder=" "
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  data-testid="reg-name"
                />
                <label htmlFor="reg-name">Full name</label>
              </div>

              <div className="float-field">
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  placeholder=" "
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  data-testid="reg-email"
                />
                <label htmlFor="reg-email">Email</label>
              </div>

              <div className="float-field">
                <input
                  id="reg-phone"
                  type="tel"
                  name="phone"
                  placeholder=" "
                  maxLength={10}
                  value={form.phone}
                  onChange={handleChange}
                  data-testid="reg-phone"
                />
                <label htmlFor="reg-phone">Phone (10 digits)</label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="float-field">
                  <input
                    id="reg-pass"
                    type="password"
                    name="password"
                    placeholder=" "
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    data-testid="reg-password"
                  />
                  <label htmlFor="reg-pass">Password</label>
                </div>
                <div className="float-field">
                  <input
                    id="reg-conf"
                    type="password"
                    name="confirmPassword"
                    placeholder=" "
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    data-testid="reg-confirm"
                  />
                  <label htmlFor="reg-conf">Confirm</label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-2"
                data-testid="reg-submit"
              >
                {loading ? <Spinner label="Creating account…" /> : 'Create account'}
              </button>
            </form>

            <p className="text-center text-sm text-ink-mute mt-7">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-700 hover:text-accent-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
