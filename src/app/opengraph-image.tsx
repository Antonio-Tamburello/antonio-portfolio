import { site } from '@/config/site';
import { getProfile } from '@/content/load';
import { ImageResponse } from 'next/og';

/**
 * Preview image shown when the site link is shared (LinkedIn, WhatsApp, Slack, X).
 * Built at deploy time from profile.json and the accent color in site.ts.
 */
export const alt = 'Antonio Tamburello — Applied AI & LLM Integrations';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const profile = await getProfile();
  const initials = profile.name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: '#09090B',
        color: '#F2F2F0',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: site.theme.accent,
            color: site.theme.accentForeground,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          {initials}
        </div>
        <div style={{ fontSize: 30, fontWeight: 600 }}>{profile.name}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            padding: '10px 18px',
            borderRadius: 999,
            background: '#1E1E23',
            fontSize: 22,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          {profile.headline}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          <span>{profile.tagline.before}</span>
          <span
            style={{
              background: site.theme.accent,
              color: site.theme.accentForeground,
              padding: '0 12px',
              borderRadius: 10,
            }}
          >
            {profile.tagline.highlight}
          </span>
          <span>{profile.tagline.after}</span>
        </div>
      </div>

      <div style={{ display: 'flex', fontSize: 24, color: '#9C9CA3' }}>{profile.title}</div>
    </div>,
    size,
  );
}
