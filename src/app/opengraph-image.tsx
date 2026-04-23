import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'My App';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

export default async function OgImage() {
  const fontData = await readFile(
    join(process.cwd(), 'public/fonts/Inter-Bold.ttf')
  );

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter',
          color: 'white',
          padding: '80px',
        }}
      >
        <h1 style={{ fontSize: 72, fontWeight: 700, margin: 0 }}>My App</h1>
        <p style={{ fontSize: 32, opacity: 0.7, marginTop: 24 }}>
          Next.js + React + shadcn/ui starter template
        </p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
