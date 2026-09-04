function ReviewScreen({ capturedPhoto, onKeep, onRetake }) {
  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,340..600;1,9..144,400..500&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .pxr-sprockets {
          display: flex;
          justify-content: space-between;
          padding: 0 24px;
        }
        .pxr-sprockets span {
          width: 6px;
          height: 10px;
          border-radius: 2px;
          background: #D8D3C7;
        }

        .pxr-polaroid {
          background: #FFFFFF;
          padding: 16px 16px 28px;
          box-shadow: 0 12px 28px rgba(23, 19, 16, 0.14);
          border-radius: 2px;
          max-width: 420px;
          width: 100%;
        }
        .pxr-polaroid img {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border-radius: 1px;
          background: #EDEAE3;
        }

        .pxr-btn-primary {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          padding: 13px 28px;
          border-radius: 999px;
          border: none;
          background: #171310;
          color: #FFFFFF;
          cursor: pointer;
          transition: background 160ms ease, transform 160ms ease;
        }
        .pxr-btn-primary:hover {
          background: #2B241D;
        }
        .pxr-btn-primary:active {
          transform: scale(0.97);
        }
        .pxr-btn-primary:focus-visible {
          outline: 2px solid #D6472C;
          outline-offset: 2px;
        }

        .pxr-btn-ghost {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          padding: 12px 26px;
          border-radius: 999px;
          border: 1px solid #D8D3C7;
          background: transparent;
          color: #171310;
          cursor: pointer;
          transition: border-color 160ms ease, color 160ms ease;
        }
        .pxr-btn-ghost:hover {
          border-color: #D6472C;
          color: #D6472C;
        }
        .pxr-btn-ghost:focus-visible {
          outline: 2px solid #D6472C;
          outline-offset: 2px;
        }
      `}</style>

      <div className="pxr-sprockets" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={`t-${i}`} />
        ))}
      </div>

      <div style={styles.corners}>
        <span style={styles.brandMark}>PIXORA</span>
        <span style={styles.exif}>REVIEW</span>
      </div>
      <div style={styles.divider} />

      <main style={styles.content}>
        <div className="pxr-polaroid">
          <img src={capturedPhoto} alt="Captured preview" />
        </div>

        <div style={styles.actions}>
          <button type="button" className="pxr-btn-primary" onClick={onKeep}>
            Keep
          </button>
          <button type="button" className="pxr-btn-ghost" onClick={onRetake}>
            Retake
          </button>
        </div>
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
    minHeight: '100vh',
    width: '100%',
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '28px 0',
    boxSizing: 'border-box',
  },
  corners: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 28px 16px',
  },
  divider: {
    height: 1,
    background: '#ECE9E1',
    margin: '0 28px',
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
    letterSpacing: '0.08em',
    color: '#9A9488',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 24px 0',
    gap: 28,
  },
  caption: {
    fontFamily: "'Fraunces', serif",
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: 18,
    color: '#171310',
    textAlign: 'center',
    margin: '14px 0 0',
  },
  actions: {
    display: 'flex',
    gap: 12,
  },
};

export default ReviewScreen;