import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'HH Goa 2026 — PFP Frame Generator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const bgData = await readFile(join(process.cwd(), 'public/og-bg.jpg'));
  const bgSrc = `data:image/jpeg;base64,${bgData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#165932',
        }}
      >
        <img
          src={bgSrc}
          width={size.width}
          height={size.height}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'linear-gradient(180deg, rgba(14,45,27,0.35) 0%, rgba(11,36,22,0.88) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '48px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 6,
              color: '#FFE500',
              textTransform: 'uppercase',
            }}
          >
            Hacker House Goa 2026
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 88,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 14,
              lineHeight: 1.05,
            }}
          >
            PFP Frame Generator
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              fontWeight: 700,
              color: '#FFE500',
              marginTop: 26,
            }}
          >
            #FrameInGoa · OCT 28–31, 2026
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
