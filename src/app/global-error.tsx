'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
        <h2>Something went wrong</h2>
        <p style={{ color: '#666' }}>{error.message || 'An unexpected error occurred'}</p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}