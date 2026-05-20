import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FlamingoMedia – Websites für lokale Marken';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b1020 0%, #14111a 50%, #1a0f20 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#F24171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              marginRight: 20,
            }}
          >
            🦩
          </div>
          <span style={{ fontSize: 52, fontWeight: 700, color: '#ffffff' }}>
            FlamingoMedia
          </span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Websites mit Pop für lokale Marken
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 32,
            fontSize: 16,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <span>Restaurant</span>
          <span>·</span>
          <span>Salon</span>
          <span>·</span>
          <span>Handwerk</span>
          <span>·</span>
          <span>Hotel</span>
          <span>·</span>
          <span>Praxis</span>
          <span>·</span>
          <span>und mehr</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
