import React, { useState } from 'react';
import api from '../api/axios.js';
import { LOCALITIES, ROOM_TYPES, GENDERS, AMENITIES } from '../constants.js';
import { Icon } from './Icon.jsx';
import Spinner from './Spinner.jsx';
import RoomCard from './RoomCard.jsx';
import { useToast } from './Toast.jsx';

const STEPS = ['Details', 'Pricing', 'Amenities', 'Photos', 'Review'];
const TOTAL = STEPS.length;

export default function ListingWizard({
  initial = {},
  submitLabel = 'Publish listing',
  onSubmit,         // async (payload) => void
  onCancel,
  busyLabel = 'Publishing…',
}) {
  const toast = useToast();

  const [step, setStep]       = useState(1);
  const [errors, setErrors]   = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading]   = useState(false);

  const [form, setForm] = useState({
    title:       initial.title       || '',
    description: initial.description || '',
    roomType:    initial.roomType    || '',
    locality:    initial.locality    || '',
    gender:      initial.gender      || '',
    price:       initial.price?.toString() || '',
    ownerName:   initial.ownerName   || '',
    ownerPhone:  initial.ownerPhone  || '',
    amenities:   initial.amenities   || [],
    images:      initial.images      || [],
    pasteUrls:   '',
  });

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const toggleAmenity = (a) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));

  const validateStep = (which = step) => {
    const errs = {};
    if (which === 1) {
      if (!form.title.trim()) errs.title = 'Give your listing a clear title.';
      else if (form.title.trim().length < 8) errs.title = 'Try a more descriptive title (8+ chars).';
      if (!form.description.trim()) errs.description = 'Add a short description for seekers.';
      else if (form.description.trim().length < 20) errs.description = 'Aim for at least 20 characters.';
      if (!form.roomType) errs.roomType = 'Pick a room type.';
      if (!form.locality) errs.locality = 'Pick a locality.';
      if (!form.gender)   errs.gender   = 'Pick a gender preference.';
    }
    if (which === 2) {
      if (!form.price || Number(form.price) <= 0) errs.price = 'Enter a valid monthly rent.';
      if (!form.ownerName.trim()) errs.ownerName = 'Add the contact name seekers will see.';
      if (!form.ownerPhone.trim()) errs.ownerPhone = 'Phone is required.';
      else if (!/^\d{10}$/.test(form.ownerPhone.replace(/\s/g, ''))) errs.ownerPhone = 'Enter a 10-digit number.';
    }
    if (which === 3 && form.amenities.length === 0) {
      errs.amenities = 'Pick at least one amenity (or skip with caution).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const allImages = () => {
    const pasted = form.pasteUrls.split('\n').map((u) => u.trim()).filter(Boolean);
    return [...form.images, ...pasted];
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, TOTAL));
    else toast.error('Please fix the highlighted fields.');
  };
  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('images[]', f));
      const { data } = await api.post('/rooms/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const urls = data.urls || data.images || [];
      set('images', [...form.images, ...urls]);
      toast.success(`${urls.length} photo${urls.length !== 1 ? 's' : ''} uploaded`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Use the URL fallback below.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) =>
    set('images', form.images.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    // Final validation across all steps
    let ok = true;
    for (let s = 1; s <= 3; s++) ok = validateStep(s) && ok;
    if (!ok) { setStep(1); return; }

    setSubmitting(true);
    try {
      await onSubmit({
        title:       form.title.trim(),
        description: form.description.trim(),
        roomType:    form.roomType,
        locality:    form.locality,
        gender:      form.gender,
        price:       Number(form.price),
        ownerName:   form.ownerName.trim(),
        ownerPhone:  form.ownerPhone.trim(),
        amenities:   form.amenities,
        images:      allImages(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const previewRoom = {
    _id: 'preview',
    title: form.title || 'Your room title',
    locality: form.locality || 'Locality',
    price: Number(form.price) || 0,
    gender: form.gender || 'Any',
    roomType: form.roomType || 'Room',
    images: allImages(),
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Stepper current={step} />

      <div className="card p-6 sm:p-8 mt-8">
        {step === 1 && (
          <Section title="Tell us about the room" subtitle="The basics seekers will see first.">
            <FloatField
              id="w-title"
              label="Listing title"
              value={form.title}
              onChange={(v) => set('title', v)}
              error={errors.title}
              placeholder="e.g. Quiet single near HNBGU library"
            />
            <FloatTextarea
              id="w-desc"
              label="Description"
              value={form.description}
              onChange={(v) => set('description', v)}
              error={errors.description}
              placeholder="Floor, nearby landmarks, house rules, what's included…"
              rows={4}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FloatSelect id="w-type" label="Room type" value={form.roomType} onChange={(v) => set('roomType', v)} error={errors.roomType} options={ROOM_TYPES} />
              <FloatSelect id="w-loc"  label="Locality"  value={form.locality} onChange={(v) => set('locality', v)} error={errors.locality} options={LOCALITIES} />
              <FloatSelect id="w-gen"  label="Gender preference" value={form.gender} onChange={(v) => set('gender', v)} error={errors.gender} options={GENDERS} />
            </div>
          </Section>
        )}

        {step === 2 && (
          <Section title="Pricing & contact" subtitle="How much, and how to reach you.">
            <div>
              <label className="label">Monthly rent (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">₹</span>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  className="input-field pl-7"
                  placeholder="4000"
                />
              </div>
              {errors.price && <FieldError msg={errors.price} />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatField
                id="w-owner-name"
                label="Owner / contact name"
                value={form.ownerName}
                onChange={(v) => set('ownerName', v)}
                error={errors.ownerName}
                placeholder="Name seekers will see"
              />

              <div>
                <label className="label">Phone (10 digits)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-ink-line bg-canvas-sunken text-ink-mute text-sm rounded-l-lg">+91</span>
                  <input
                    type="tel"
                    value={form.ownerPhone}
                    onChange={(e) => set('ownerPhone', e.target.value)}
                    className="input-field rounded-l-none"
                    maxLength={10}
                    placeholder="9876543210"
                  />
                </div>
                {errors.ownerPhone && <FieldError msg={errors.ownerPhone} />}
              </div>
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section title="What's included?" subtitle="Pick everything that applies. The more, the better.">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AMENITIES.map((a) => {
                const on = form.amenities.includes(a);
                return (
                  <label
                    key={a}
                    className={`cursor-pointer rounded-xl border-2 px-3.5 py-3 text-sm transition-all flex items-center justify-between gap-2 ${
                      on ? 'border-ink bg-canvas-sunken text-ink font-medium' : 'border-ink-line hover:border-ink-mute text-ink-soft'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded border-2 grid place-items-center transition-colors ${
                        on ? 'border-ink bg-ink' : 'border-ink-line'
                      }`}>
                        {on && <Icon name="check" className="w-3 h-3 text-canvas" />}
                      </span>
                      {a}
                    </span>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleAmenity(a)}
                      className="sr-only"
                    />
                  </label>
                );
              })}
            </div>
            {errors.amenities && <FieldError msg={errors.amenities} />}
          </Section>
        )}

        {step === 4 && (
          <Section title="Photos" subtitle="Clear, well-lit photos get 3× more contacts.">
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-ink-line hover:border-ink-mute hover:bg-canvas-sunken transition-all p-8 text-center">
              <Icon name="upload" className="w-6 h-6 mx-auto text-ink-mute" />
              <p className="text-sm font-medium text-ink mt-2">
                {uploading ? 'Uploading…' : 'Click to upload photos'}
              </p>
              <p className="text-xs text-ink-mute mt-1">PNG, JPG up to ~5 MB each</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>

            {form.images.length > 0 && (
              <div className="mt-5">
                <p className="label">Uploaded ({form.images.length})</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {form.images.map((url, idx) => (
                    <div key={idx} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-ink-line bg-canvas-sunken">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-ink/80 text-canvas hover:bg-ink grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove photo"
                      >
                        <Icon name="close" className="w-3.5 h-3.5" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 chip bg-ink text-canvas border-transparent text-[10px]">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <label className="label">Or paste image URLs (one per line)</label>
              <textarea
                rows={3}
                value={form.pasteUrls}
                onChange={(e) => set('pasteUrls', e.target.value)}
                className="input-field font-mono text-xs resize-none"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </Section>
        )}

        {step === 5 && (
          <Section title="Review & publish" subtitle="One last look before going live.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="label mb-3">Live preview</p>
                <RoomCard room={previewRoom} preview />
              </div>
              <div>
                <p className="label mb-3">Summary</p>
                <dl className="card p-5 text-sm divide-y divide-ink-line">
                  <SummaryRow label="Title"     value={form.title || '—'} />
                  <SummaryRow label="Type"      value={form.roomType || '—'} />
                  <SummaryRow label="Locality"  value={form.locality || '—'} />
                  <SummaryRow label="Gender"    value={form.gender || '—'} />
                  <SummaryRow label="Rent"      value={form.price ? `₹${Number(form.price).toLocaleString('en-IN')}/mo` : '—'} />
                  <SummaryRow label="Owner"     value={form.ownerName || '—'} />
                  <SummaryRow label="Phone"     value={form.ownerPhone ? `+91 ${form.ownerPhone}` : '—'} />
                  <SummaryRow label="Amenities" value={form.amenities.length ? `${form.amenities.length} selected` : 'None'} />
                  <SummaryRow label="Photos"    value={`${allImages().length} attached`} />
                </dl>
              </div>
            </div>

            {form.description && (
              <div className="mt-2">
                <p className="label mb-1.5">Description</p>
                <p className="text-sm text-ink-soft whitespace-pre-line">{form.description}</p>
              </div>
            )}
          </Section>
        )}

        {/* Footer / nav */}
        <div className="flex items-center justify-between pt-7 mt-7 border-t border-ink-line gap-2">
          <div>
            {step > 1 ? (
              <button onClick={back} className="btn-ghost text-sm" type="button">
                <Icon name="chevronL" className="w-4 h-4" /> Back
              </button>
            ) : onCancel ? (
              <button onClick={onCancel} className="btn-ghost text-sm" type="button">
                Cancel
              </button>
            ) : <span />}
          </div>

          <div className="flex items-center gap-2 text-xs text-ink-mute">
            Step {step} of {TOTAL}
          </div>

          {step < TOTAL ? (
            <button onClick={next} className="btn-primary text-sm" type="button" data-testid="wizard-next">
              Continue
              <Icon name="chevronR" className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-accent text-sm"
              type="button"
              data-testid="wizard-submit"
            >
              {submitting ? <Spinner label={busyLabel} /> : (
                <>
                  <Icon name="check" className="w-4 h-4" />
                  {submitLabel}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ current }) {
  return (
    <ol className="flex items-center gap-1.5 sm:gap-2" aria-label="Wizard progress">
      {STEPS.map((label, idx) => {
        const step  = idx + 1;
        const done  = step < current;
        const active = step === current;
        return (
          <React.Fragment key={label}>
            <li className="flex items-center gap-2 min-w-0">
              <span className={`w-7 h-7 shrink-0 rounded-full grid place-items-center text-xs font-semibold transition-all ${
                done   ? 'bg-ink text-canvas'
                : active ? 'bg-canvas-raised text-ink ring-2 ring-ink'
                : 'bg-canvas-sunken text-ink-faint'
              }`}>
                {done ? <Icon name="check" className="w-3.5 h-3.5" /> : step}
              </span>
              <span className={`hidden sm:inline text-xs font-medium truncate ${active ? 'text-ink' : 'text-ink-mute'}`}>
                {label}
              </span>
            </li>
            {idx < STEPS.length - 1 && (
              <li aria-hidden="true" className={`flex-1 h-px ${step < current ? 'bg-ink' : 'bg-ink-line'}`} />
            )}
          </React.Fragment>
        );
      })}
    </ol>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
        {subtitle && <p className="text-sm text-ink-mute mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function FloatField({ id, label, value, onChange, error, placeholder, type = 'text' }) {
  return (
    <div>
      <div className="float-field">
        <input
          id={id}
          type={type}
          placeholder=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && <FieldError msg={error} />}
      {placeholder && !error && (
        <p className="text-[11px] text-ink-faint mt-1.5">e.g. {placeholder}</p>
      )}
    </div>
  );
}

function FloatTextarea({ id, label, value, onChange, error, placeholder, rows = 3 }) {
  return (
    <div>
      <div className="float-field">
        <textarea
          id={id}
          rows={rows}
          placeholder=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="resize-none"
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && <FieldError msg={error} />}
      {placeholder && !error && (
        <p className="text-[11px] text-ink-faint mt-1.5">{placeholder}</p>
      )}
    </div>
  );
}

function FloatSelect({ id, label, value, onChange, error, options }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <FieldError msg={error} />}
    </div>
  );
}

function FieldError({ msg }) {
  return (
    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
      <Icon name="alert" className="w-3 h-3" /> {msg}
    </p>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between py-2.5 first:pt-0 last:pb-0">
      <dt className="text-ink-mute">{label}</dt>
      <dd className="text-ink font-medium text-right max-w-[55%] truncate">{value}</dd>
    </div>
  );
}
