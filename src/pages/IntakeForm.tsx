import { FormEvent, useRef, useState } from 'react'

// ============================================================
// SALESFORCE WEB-TO-LEAD CONFIGURATION
// ============================================================
// Replace the placeholder values below before going live.
// These are the ONLY values you need to change to connect
// this form to your Salesforce org.
//
// Where to find your Org ID:
//   Salesforce Setup → Company Settings → Company Information
//   → Salesforce.com Organization ID
//
// Where to find custom field IDs:
//   Salesforce Setup → Object Manager → Lead
//   → Fields & Relationships → click the field → Field Name column
//   The API name for custom fields looks like: 00N1a00000XXXXXXAA
// ============================================================

const SF_ORG_ID = 'YOUR_SALESFORCE_ORG_ID'
// e.g. "00D1a000000XXXXX"

const SF_RETURN_URL = 'https://www.yourdomain.com/thank-you'
// Full URL of your main website's thank-you page.
// Salesforce redirects the user here after a successful submission.

const SF_ACTION =
  'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8'

// Custom field IDs — replace each placeholder with your actual Salesforce field ID
const SF_FIELD = {
  homeSize: '00N_HOME_SIZE_FIELD_ID',
  // e.g. "00N1a00000XXXXXXAA"  (Lead: Home Size custom field)

  serviceType: '00N_SERVICE_TYPE_FIELD_ID',
  // e.g. "00N1a00000XXXXXXBB"  (Lead: Service Type custom field)

  frequency: '00N_FREQUENCY_FIELD_ID',
  // e.g. "00N1a00000XXXXXXCC"  (Lead: Cleaning Frequency custom field)

  startDate: '00N_START_DATE_FIELD_ID',
  // e.g. "00N1a00000XXXXXXDD"  (Lead: Preferred Start Date custom field)
}

// ============================================================

const HOME_SIZES = [
  { value: 'Studio / 1 Bedroom', label: 'Studio / 1 Bedroom' },
  { value: '2 Bedrooms', label: '2 Bedrooms' },
  { value: '3 Bedrooms', label: '3 Bedrooms' },
  { value: '4 Bedrooms', label: '4 Bedrooms' },
  { value: '5+ Bedrooms', label: '5+ Bedrooms' },
]

const SERVICE_TYPES = [
  { value: 'Standard Cleaning', label: 'Standard Cleaning' },
  { value: 'Deep Cleaning', label: 'Deep Cleaning' },
  { value: 'Move-In / Move-Out', label: 'Move-In / Move-Out Cleaning' },
  { value: 'Post-Construction', label: 'Post-Construction Cleaning' },
]

const FREQUENCIES = [
  { value: 'One-Time', label: 'One-Time' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Bi-Weekly', label: 'Bi-Weekly (Every 2 Weeks)' },
  { value: 'Monthly', label: 'Monthly' },
]

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'Washington D.C.' },
]

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  homeSize: string
  serviceType: string
  frequency: string
  startDate: string
  notes: string
}

type Errors = Partial<Record<keyof FormData, string>>

const INITIAL: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  homeSize: '',
  serviceType: '',
  frequency: '',
  startDate: '',
  notes: '',
}

function localDateMin(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function validate(data: FormData): Errors {
  const e: Errors = {}
  if (!data.firstName.trim()) e.firstName = 'First name is required'
  if (!data.lastName.trim()) e.lastName = 'Last name is required'
  if (!data.email.trim()) {
    e.email = 'Email address is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    e.email = 'Enter a valid email address'
  }
  if (!data.phone.trim()) e.phone = 'Phone number is required'
  if (!data.street.trim()) e.street = 'Street address is required'
  if (!data.city.trim()) e.city = 'City is required'
  if (!data.state) e.state = 'State is required'
  if (!data.zip.trim()) {
    e.zip = 'ZIP code is required'
  } else if (!/^\d{5}(-\d{4})?$/.test(data.zip.trim())) {
    e.zip = 'Enter a valid 5-digit ZIP code'
  }
  if (!data.homeSize) e.homeSize = 'Please select your home size'
  if (!data.serviceType) e.serviceType = 'Please select a service type'
  if (!data.frequency) e.frequency = 'Please select how often'
  if (!data.startDate) e.startDate = 'Please select a preferred start date'
  return e
}

// ---- shared sub-components ----

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 whitespace-nowrap">
        {title}
      </span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  )
}

function ErrorIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div id={id}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5" role="alert">
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return [
    'w-full rounded-lg border bg-white px-4 py-3 text-slate-900 text-sm',
    'placeholder-slate-400 transition-colors',
    'focus:outline-none focus:ring-2',
    hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100',
  ].join(' ')
}

function selectCls(hasError: boolean) {
  return [
    'w-full rounded-lg border bg-white px-4 py-3 text-sm appearance-none cursor-pointer',
    'transition-colors focus:outline-none focus:ring-2',
    hasError
      ? 'border-red-400 text-slate-900 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-100',
  ].join(' ')
}

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
        <svg
          className="h-4 w-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

function LogoMark() {
  return (
    <div className="inline-flex items-center gap-2.5">
      {/*
        Logo placeholder — replace this entire <div> with your actual logo:
        <img src="/logo.svg" alt="Your Company" className="h-8" />
      */}
      <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
        <svg
          className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </div>
      {/* Company name placeholder — replace with your actual company name */}
      <span className="text-xl font-bold text-slate-800 tracking-tight">YourCompany</span>
    </div>
  )
}

// ---- main form component ----

export default function IntakeForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [data, setData] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({})
  const [honeypot, setHoneypot] = useState('')
  const minDate = localDateMin()

  function set(field: keyof FormData) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }))
      // Clear the error for this field as the user corrects it
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function blur(field: keyof FormData) {
    return () => setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Only show an error if the field has been touched (blurred or submit attempted)
  function err(field: keyof FormData): string | undefined {
    return touched[field] ? errors[field] : undefined
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const newErrors = validate(data)
    // Mark all fields as touched so every error becomes visible
    const allTouched = Object.fromEntries(
      Object.keys(INITIAL).map((k) => [k, true])
    ) as Record<keyof FormData, boolean>
    setErrors(newErrors)
    setTouched(allTouched)

    if (Object.keys(newErrors).length > 0) {
      // Scroll to the first field with an error
      const firstKey = Object.keys(newErrors)[0] as keyof FormData
      document
        .getElementById(`field-${firstKey}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    // Honeypot filled → bot detected; silently redirect without posting to Salesforce
    if (honeypot) {
      window.location.href = SF_RETURN_URL
      return
    }

    // Valid — submit the native form to Salesforce Web-to-Lead
    formRef.current?.submit()
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Brand header */}
        <div className="text-center mb-6">
          <LogoMark />
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Card hero */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-8 text-white">
            <h1 className="text-2xl font-bold mb-2">Request Housekeeping Services</h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Fill out the form below and we'll be in touch within one business day to confirm your
              appointment.
            </p>
          </div>

          {/* The form */}
          <form
            ref={formRef}
            action={SF_ACTION}
            method="POST"
            onSubmit={handleSubmit}
            noValidate
            className="px-8 py-8 space-y-8"
          >
            {/* ── Salesforce hidden fields ── */}
            <input type="hidden" name="oid" value={SF_ORG_ID} />
            <input type="hidden" name="retURL" value={SF_RETURN_URL} />
            <input type="hidden" name="lead_source" value="Web" />

            {/* ── Honeypot anti-spam field ──
                Visually hidden but in the DOM — real users never see or fill it.
                If it contains a value on submit, we assume it's a bot. */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-9999px',
                top: 'auto',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
              }}
            >
              <label htmlFor="hp-website">Website</label>
              <input
                id="hp-website"
                name="website"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* ── Section 1: Contact Information ── */}
            <section aria-labelledby="section-contact">
              <SectionHeader title="Contact Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="field-firstName" label="First Name" required error={err('firstName')}>
                  <input
                    type="text"
                    name="first_name"
                    value={data.firstName}
                    onChange={set('firstName')}
                    onBlur={blur('firstName')}
                    className={inputCls(!!err('firstName'))}
                    placeholder="Jane"
                    autoComplete="given-name"
                    aria-required="true"
                    aria-invalid={!!err('firstName') || undefined}
                  />
                </Field>

                <Field id="field-lastName" label="Last Name" required error={err('lastName')}>
                  <input
                    type="text"
                    name="last_name"
                    value={data.lastName}
                    onChange={set('lastName')}
                    onBlur={blur('lastName')}
                    className={inputCls(!!err('lastName'))}
                    placeholder="Smith"
                    autoComplete="family-name"
                    aria-required="true"
                    aria-invalid={!!err('lastName') || undefined}
                  />
                </Field>

                <Field id="field-email" label="Email Address" required error={err('email')}>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={set('email')}
                    onBlur={blur('email')}
                    className={inputCls(!!err('email'))}
                    placeholder="jane@example.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={!!err('email') || undefined}
                  />
                </Field>

                <Field id="field-phone" label="Phone Number" required error={err('phone')}>
                  <input
                    type="tel"
                    name="phone"
                    value={data.phone}
                    onChange={set('phone')}
                    onBlur={blur('phone')}
                    className={inputCls(!!err('phone'))}
                    placeholder="(555) 867-5309"
                    autoComplete="tel"
                    aria-required="true"
                    aria-invalid={!!err('phone') || undefined}
                  />
                </Field>
              </div>
            </section>

            {/* ── Section 2: Service Address ── */}
            <section aria-labelledby="section-address">
              <SectionHeader title="Service Address" />
              <div className="space-y-4">
                <Field id="field-street" label="Street Address" required error={err('street')}>
                  <input
                    type="text"
                    name="street"
                    value={data.street}
                    onChange={set('street')}
                    onBlur={blur('street')}
                    className={inputCls(!!err('street'))}
                    placeholder="123 Main St, Apt 4B"
                    autoComplete="street-address"
                    aria-required="true"
                    aria-invalid={!!err('street') || undefined}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  <div className="sm:col-span-2">
                    <Field id="field-city" label="City" required error={err('city')}>
                      <input
                        type="text"
                        name="city"
                        value={data.city}
                        onChange={set('city')}
                        onBlur={blur('city')}
                        className={inputCls(!!err('city'))}
                        placeholder="Boston"
                        autoComplete="address-level2"
                        aria-required="true"
                        aria-invalid={!!err('city') || undefined}
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field id="field-state" label="State" required error={err('state')}>
                      <SelectWrap>
                        <select
                          name="state"
                          value={data.state}
                          onChange={set('state')}
                          onBlur={blur('state')}
                          className={selectCls(!!err('state'))}
                          aria-required="true"
                          aria-invalid={!!err('state') || undefined}
                        >
                          <option value="">Select state</option>
                          {US_STATES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </SelectWrap>
                    </Field>
                  </div>

                  <div className="sm:col-span-1">
                    <Field id="field-zip" label="ZIP Code" required error={err('zip')}>
                      <input
                        type="text"
                        name="zip"
                        value={data.zip}
                        onChange={set('zip')}
                        onBlur={blur('zip')}
                        className={inputCls(!!err('zip'))}
                        placeholder="02101"
                        autoComplete="postal-code"
                        inputMode="numeric"
                        maxLength={10}
                        aria-required="true"
                        aria-invalid={!!err('zip') || undefined}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Section 3: Service Details ── */}
            <section aria-labelledby="section-service">
              <SectionHeader title="Service Details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="field-homeSize" label="Home Size" required error={err('homeSize')}>
                  <SelectWrap>
                    <select
                      name={SF_FIELD.homeSize}
                      value={data.homeSize}
                      onChange={set('homeSize')}
                      onBlur={blur('homeSize')}
                      className={selectCls(!!err('homeSize'))}
                      aria-required="true"
                      aria-invalid={!!err('homeSize') || undefined}
                    >
                      <option value="">Select size</option>
                      {HOME_SIZES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </SelectWrap>
                </Field>

                <Field id="field-serviceType" label="Service Type" required error={err('serviceType')}>
                  <SelectWrap>
                    <select
                      name={SF_FIELD.serviceType}
                      value={data.serviceType}
                      onChange={set('serviceType')}
                      onBlur={blur('serviceType')}
                      className={selectCls(!!err('serviceType'))}
                      aria-required="true"
                      aria-invalid={!!err('serviceType') || undefined}
                    >
                      <option value="">Select type</option>
                      {SERVICE_TYPES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </SelectWrap>
                </Field>

                <Field id="field-frequency" label="How Often?" required error={err('frequency')}>
                  <SelectWrap>
                    <select
                      name={SF_FIELD.frequency}
                      value={data.frequency}
                      onChange={set('frequency')}
                      onBlur={blur('frequency')}
                      className={selectCls(!!err('frequency'))}
                      aria-required="true"
                      aria-invalid={!!err('frequency') || undefined}
                    >
                      <option value="">Select frequency</option>
                      {FREQUENCIES.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </SelectWrap>
                </Field>

                <Field
                  id="field-startDate"
                  label="Preferred Start Date"
                  required
                  error={err('startDate')}
                >
                  <input
                    type="date"
                    name={SF_FIELD.startDate}
                    value={data.startDate}
                    onChange={set('startDate')}
                    onBlur={blur('startDate')}
                    className={inputCls(!!err('startDate'))}
                    min={minDate}
                    aria-required="true"
                    aria-invalid={!!err('startDate') || undefined}
                  />
                </Field>
              </div>
            </section>

            {/* ── Section 4: Additional Notes ── */}
            <section aria-labelledby="section-notes">
              <SectionHeader title="Additional Information" />
              <Field id="field-notes" label="Special Requests or Notes" error={err('notes')}>
                <textarea
                  name="description"
                  value={data.notes}
                  onChange={set('notes')}
                  onBlur={blur('notes')}
                  rows={4}
                  className={`${inputCls(false)} resize-y`}
                  placeholder="Any pets, entry instructions, areas to focus on, or other details we should know…"
                />
              </Field>
            </section>

            {/* ── Submit ── */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Request My Cleaning →
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                Fields marked <span className="text-red-500">*</span> are required. We'll respond
                within one business day.
              </p>
            </div>
          </form>
        </div>

        {/* Page footer */}
        <p className="mt-6 text-center text-xs text-slate-400 pb-4">
          By submitting this form, you agree to be contacted regarding your service request.
        </p>
      </div>
    </div>
  )
}
