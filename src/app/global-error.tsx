'use client';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <style>{`
          button:focus-visible {
            outline: 2px solid #0070f3;
            outline-offset: 2px;
          }
        `}</style>
        <div role="alert">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Something went wrong</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          {process.env.NODE_ENV === 'development'
            ? (error.message || 'An unexpected error occurred')
            : 'An unexpected error occurred'}
        </p>
        {error.digest && (
          <p style={{ color: '#999', fontSize: '0.75rem', marginTop: '0.25rem' }}>
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={() => unstable_retry()}
          style={{
            marginTop: '1.5rem',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #ccc',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Try again
        </button>
        </div>
      </body>
    </html>
  );
}
