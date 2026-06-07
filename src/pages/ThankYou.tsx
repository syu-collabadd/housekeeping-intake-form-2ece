// ============================================================
// Replace the href below with your actual website URL
const WEBSITE_URL = 'https://www.yourdomain.com'
// ============================================================

function LogoMark() {
  return (
    <div className="inline-flex items-center gap-2.5">
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
      <span className="text-xl font-bold text-slate-800 tracking-tight">YourCompany</span>
    </div>
  )
}

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <LogoMark />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          {/* Success icon */}
          <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3">Thank You!</h1>
          <p className="text-slate-600 leading-relaxed mb-8">
            Your request has been received. We'll reach out within one business day to confirm your
            appointment details and answer any questions.
          </p>

          <a
            href={WEBSITE_URL}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Website
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Didn't mean to submit?{' '}
          <a
            href={WEBSITE_URL}
            className="underline hover:text-slate-600 transition-colors"
          >
            Return to our homepage
          </a>
        </p>
      </div>
    </div>
  )
}
