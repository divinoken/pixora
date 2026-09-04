import Camera from '../components/camera/Camera';
import Countdown from '../components/countdown/Countdown';

const SHOT_OPTIONS = [4, 6, 8];

function CameraScreen({
  cameraRef,
  onCountdownComplete,
  countdownResetKey,
  sessionSize,
  onSessionSizeChange,
  isCountdownActive,
  onStartCountdown,
  onRetakeLast,
  isSessionLocked,
  canStartNewShot,
  isSessionFull,
}) {
  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340..600&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

        html, body {
          background: #FFFFFF;
          margin: 0;
        }

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

        .pxr-select-wrap {
          position: relative;
          display: inline-block;
        }
        .pxr-shot-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.04em;
          padding: 11px 42px 11px 20px;
          border-radius: 999px;
          border: 1px solid #D8D3C7;
          background: #FFFFFF;
          color: #171310;
          min-width: 160px;
          cursor: pointer;
          transition: border-color 160ms ease, background 160ms ease;
        }
        .pxr-shot-select:hover:not(:disabled) {
          border-color: #171310;
        }
        .pxr-shot-select:focus-visible {
          outline: 2px solid #D6472C;
          outline-offset: 2px;
        }
        .pxr-shot-select:disabled {
          cursor: not-allowed;
          background: #FAF9F6;
          color: #9A9488;
          border-color: #ECE9E1;
        }
        .pxr-select-arrow {
          position: absolute;
          right: 18px;
          top: 50%;
          width: 7px;
          height: 7px;
          border-right: 1.5px solid #171310;
          border-bottom: 1.5px solid #171310;
          transform: translateY(-65%) rotate(45deg);
          pointer-events: none;
        }
        .pxr-select-arrow.is-disabled {
          border-color: #C9C4BA;
        }
        .pxr-lock-note {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.04em;
          color: #9A9488;
          margin: 8px 0 0;
        }

        .pxr-viewfinder {
          position: relative;
          border-radius: 16px;
          border: 1px solid #ECE9E1;
          overflow: hidden;
          background: #0B0B0A;
          width: min(100%, 640px);
          aspect-ratio: 4 / 3;
          max-height: min(68vh, 560px);
        }
        .pxr-bracket {
          position: absolute;
          width: 22px;
          height: 22px;
          border: 1.5px solid #FFFFFF;
          opacity: 0.85;
          z-index: 2;
          pointer-events: none;
        }
        .pxr-bracket.tl { top: 14px; left: 14px; border-right: none; border-bottom: none; }
        .pxr-bracket.tr { top: 14px; right: 14px; border-left: none; border-bottom: none; }
        .pxr-bracket.bl { bottom: 14px; left: 14px; border-right: none; border-top: none; }
        .pxr-bracket.br { bottom: 14px; right: 14px; border-left: none; border-top: none; }

        .pxr-countdown-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          pointer-events: none;
          background: rgba(23, 19, 16, 0.35);
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
        .pxr-btn-primary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          background: #171310;
        }

        .pxr-btn-secondary {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          padding: 13px 28px;
          border-radius: 999px;
          border: 1px solid #D8D3C7;
          background: #FFFFFF;
          color: #171310;
          cursor: pointer;
          transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
        }
        .pxr-btn-secondary:hover {
          border-color: #171310;
        }
        .pxr-btn-secondary:active {
          transform: scale(0.97);
        }

        .pxr-action-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .pxr-status-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: #9A9488;
          margin-top: 12px;
          text-align: center;
        }

        @media (max-width: 640px) {
          .pxr-sprockets {
            padding: 0 14px;
          }
          .pxr-shot-select {
            min-width: 140px;
          }
          .pxr-action-row {
            flex-direction: column;
            width: 100%;
          }
          .pxr-btn-primary,
          .pxr-btn-secondary {
            width: min(100%, 220px);
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
          {sessionSize} shots&nbsp;&nbsp;&middot;&nbsp;&nbsp;auto flash
        </span>
      </div>
      <div style={styles.divider} />

      <main style={styles.content}>
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Number of shots</legend>
          <div className="pxr-select-wrap">
            <select
              className="pxr-shot-select"
              value={sessionSize}
              onChange={onSessionSizeChange}
              disabled={isSessionLocked}
              aria-label="Select number of shots"
              title={isSessionLocked ? 'Shot count is locked for this session.' : 'Choose how many shots you want'}
            >
              {SHOT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} shots
                </option>
              ))}
            </select>
            <span className={`pxr-select-arrow${isSessionLocked ? ' is-disabled' : ''}`} aria-hidden="true" />
          </div>
          {isSessionLocked && (
            <p className="pxr-lock-note">Locked for this session</p>
          )}
        </fieldset>

        <div className="pxr-viewfinder" style={styles.viewfinder}>
          <span className="pxr-bracket tl" aria-hidden="true" />
          <span className="pxr-bracket tr" aria-hidden="true" />
          <span className="pxr-bracket bl" aria-hidden="true" />
          <span className="pxr-bracket br" aria-hidden="true" />

          <Camera ref={cameraRef} />

          {isCountdownActive && (
            <div className="pxr-countdown-overlay">
              <Countdown
                onComplete={onCountdownComplete}
                isActive={true}
                resetKey={countdownResetKey}
              />
            </div>
          )}
        </div>

        {!isCountdownActive && (
          <div className="pxr-action-row">
            <button
              type="button"
              className="pxr-btn-primary"
              onClick={onStartCountdown}
              disabled={!canStartNewShot}
            >
              Start
            </button>
            {isSessionFull && onRetakeLast && (
              <button type="button" className="pxr-btn-secondary" onClick={onRetakeLast}>
                Retake last
              </button>
            )}
          </div>
        )}

        {!isCountdownActive && !canStartNewShot && (
          <div className="pxr-status-text">Session complete — retake only</div>
        )}
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
    letterSpacing: '0.04em',
    color: '#9A9488',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 24px 0',
  },
  fieldset: {
    border: 'none',
    margin: 0,
    padding: 0,
    marginBottom: 22,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  legend: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    color: '#6B665C',
    marginBottom: 10,
    padding: 0,
  },
  viewfinder: {
    width: '100%',
    maxWidth: 640,
    aspectRatio: '4 / 3',
    maxHeight: 'min(68vh, 560px)',
  },
};

export default CameraScreen;