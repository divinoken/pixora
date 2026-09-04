function GalleryScreen({
  shots,
  selectedShot,
  onSelectShot,
  onTakeAnotherShot,
  isSessionFull,
  maxShots,
  onResetSession,
}) {
  const selectedIndex = shots.findIndex((shot) => shot.id === selectedShot?.id);

  const handleNextShot = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onTakeAnotherShot();
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
          width: 6px;
          height: 10px;
          border-radius: 2px;
          background: #D8D3C7;
        }

        .pxr-gallery-body {
          display: flex;
          gap: 24px;
          width: 100%;
          max-width: 760px;
          align-items: stretch;
        }

        .pxr-preview-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 0;
        }
        .pxr-preview {
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          border: 2px solid #171310;
          box-shadow: 0 12px 28px rgba(23, 19, 16, 0.14);
          aspect-ratio: 4 / 3;
        }
        .pxr-preview img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pxr-preview.is-empty {
          background: #FAF9F6;
          border: 2px dashed #D8D3C7;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pxr-preview-empty-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          color: #9A9488;
        }
        .pxr-preview-caption {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #9A9488;
          margin: 12px 0 0;
        }

        .pxr-filmstrip {
          width: 96px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
          padding-right: 2px;
        }
        .pxr-thumb {
          border: none;
          border-left: 3px solid transparent;
          border-radius: 6px;
          background: #FAF9F6;
          padding: 5px;
          cursor: pointer;
          transition: border-color 160ms ease, background 160ms ease;
        }
        .pxr-thumb img {
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          border-radius: 4px;
        }
        .pxr-thumb:hover {
          background: #F1EEE7;
        }
        .pxr-thumb.is-selected {
          border-left-color: #D6472C;
          background: #F1EEE7;
        }
        .pxr-thumb:focus-visible {
          outline: 2px solid #D6472C;
          outline-offset: 2px;
        }

        .pxr-footer {
          width: 100%;
          max-width: 760px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid #ECE9E1;
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
          white-space: nowrap;
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

        @media (max-width: 640px) {
          .pxr-gallery-body {
            flex-direction: column-reverse;
          }
          .pxr-filmstrip {
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
            overflow-y: visible;
          }
          .pxr-filmstrip .pxr-thumb {
            flex: 0 0 68px;
            border-left: none;
            border-bottom: 3px solid transparent;
          }
          .pxr-filmstrip .pxr-thumb.is-selected {
            border-bottom-color: #D6472C;
          }
        }
      `}</style>

      <div className="pxr-sprockets" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={`t-${i}`} />
        ))}
      </div>

      <div style={styles.corners}>
        <span style={styles.brandMark}>PIXORA</span>
        <span style={styles.exif}>
          {shots.length} / {maxShots} shots
        </span>
      </div>
      <div style={styles.divider} />

      <main style={styles.content}>
        <span style={styles.eyebrow}>SESSION SHOTS</span>
        <h2 style={styles.title}>Pick your favorite</h2>

        <div className="pxr-gallery-body">
          <div className="pxr-preview-pane">
            {selectedShot ? (
              <div className="pxr-preview">
                <img src={selectedShot.src} alt="Selected shot" />
              </div>
            ) : (
              <div className="pxr-preview is-empty">
                <span className="pxr-preview-empty-text">Select a shot to preview</span>
              </div>
            )}
            {selectedShot && (
              <p className="pxr-preview-caption">
                SHOT {String(selectedIndex + 1).padStart(2, '0')} OF {String(shots.length).padStart(2, '0')}
              </p>
            )}
          </div>

          <div className="pxr-filmstrip">
            {shots.map((shot, index) => (
              <button
                key={shot.id}
                type="button"
                onClick={() => onSelectShot(shot.id)}
                className={`pxr-thumb${shot.id === selectedShot?.id ? ' is-selected' : ''}`}
                aria-pressed={shot.id === selectedShot?.id}
                aria-label={`Select shot ${index + 1}`}
              >
                <img src={shot.src} alt={`Shot ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="pxr-footer">
          {isSessionFull ? (
            <>
              <p style={styles.helperText}>Session full &middot; {maxShots} shots selected</p>
              <button type="button" className="pxr-btn-primary" onClick={onResetSession}>
                Proceed
              </button>
            </>
          ) : (
            <>
              <p style={styles.helperText}>
                {shots.length} of {maxShots} shots taken
              </p>
              <button type="button" className="pxr-btn-primary" onClick={handleNextShot}>
                Next shot
              </button>
            </>
          )}
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
    padding: '24px 24px 20px',
  },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: '0.16em',
    color: '#D6472C',
    marginBottom: 8,
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontOpticalSizing: 'auto',
    fontWeight: 480,
    fontSize: 'clamp(24px, 4vw, 32px)',
    color: '#171310',
    margin: '0 0 24px',
  },
  helperText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    letterSpacing: '0.04em',
    color: '#6B665C',
    margin: 0,
  },
};

export default GalleryScreen;