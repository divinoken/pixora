import { useState } from 'react';

function LandingPage({ onStart }) {
  const [flashing, setFlashing] = useState(false);

  const handleStart = () => {
    if (flashing) return;
    setFlashing(true);
    window.setTimeout(() => {
      onStart();
    }, 380);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340..600&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .pxr-sprockets {
          display: flex;
          justify-content: space-between;
          padding: 0 24px;
        }
        .pxr-sprockets span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #D8D3C7;
        }

        .pxr-shutter {
          position: relative;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: none;
          background: #171310;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 160ms ease;
        }
        .pxr-shutter::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid #D8D3C7;
          transition: inset 220ms ease, border-color 220ms ease;
        }
        .pxr-shutter:hover::before {
          inset: -12px;
          border-color: #D6472C;
        }
        .pxr-shutter:active {
          transform: scale(0.94);
        }
        .pxr-shutter:focus-visible {
          outline: 2px solid #D6472C;
          outline-offset: 6px;
        }
        .pxr-shutter-ring {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          border: 1.5px solid #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pxr-shutter-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #FFFFFF;
        }

        .pxr-flash {
          position: fixed;
          inset: 0;
          background: #FFFFFF;
          pointer-events: none;
          opacity: 0;
          z-index: 50;
        }
        .pxr-flash.is-active {
          animation: pxr-flash-anim 380ms ease-out forwards;
        }
        @keyframes pxr-flash-anim {
          0% { opacity: 0; }
          35% { opacity: 1; }
          100% { opacity: 1; }
        }

        @media (max-width: 480px) {
          .pxr-corner-right { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pxr-shutter, .pxr-shutter::before { transition: none; }
          .pxr-flash.is-active { animation-duration: 1ms; }
        }
      `}</style>

      <div className={`pxr-flash${flashing ? ' is-active' : ''}`} aria-hidden="true" />

      <div className="pxr-sprockets" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={`t-${i}`} />
        ))}
      </div>

      <div style={styles.corners}>
        <span style={styles.brandMark}>PIXORA</span>
        <span className="pxr-corner-right" style={styles.exif}>
          N&deg;001&nbsp;&nbsp;f/2.8&nbsp;&nbsp;1/125&nbsp;&nbsp;ISO 400
        </span>
      </div>

      <main style={styles.hero}>
        <h1 style={styles.title}>Welcome to Pixora!</h1>
        <p style={styles.subtitle}>Strike a pose. Make it yours.</p>

        <button
          type="button"
          className="pxr-shutter"
          onClick={handleStart}
          aria-label="Start session"
          style={{ marginTop: 40 }}
        >
          <span className="pxr-shutter-ring">
            <span className="pxr-shutter-label">START</span>
          </span>
        </button>
      </main>

      <div className="pxr-sprockets" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={`b-${i}`} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '28px 0',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  corners: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 28px 0',
  },
  brandMark: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    letterSpacing: '0.14em',
    color: '#171310',
  },
  exif: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: '0.04em',
    color: '#9A9488',
  },
  hero: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '0 24px',
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontOpticalSizing: 'auto',
    fontWeight: 480,
    fontSize: 'clamp(32px, 6vw, 44px)',
    color: '#171310',
    margin: 0,
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: 16,
    color: '#6B665C',
    margin: '10px 0 0',
  },
};

export default LandingPage;