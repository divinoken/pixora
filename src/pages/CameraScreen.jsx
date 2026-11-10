import PhotoboothShell from '../components/PhotoboothShell';
import Camera from '../components/camera/Camera';
import Countdown from '../components/countdown/Countdown';

const pad = (n) => String(n).padStart(2, '0');

function CameraScreen({
  cameraRef,
  onCountdownComplete,
  countdownResetKey,
  sessionSize,
  onSessionSizeChange,
  isCountdownActive,
  onStartCountdown,
  isSessionLocked,
  shotsTaken = 0,
  onBrandClick,
  shotOptions,
}) {
  const currentShot = Math.min(shotsTaken + 1, sessionSize);

  return (
    <PhotoboothShell readout={`SHOT ${pad(currentShot)} / ${pad(sessionSize)}`} onBrandClick={onBrandClick}>
      <div className="pxr-toolbar">
        <label htmlFor="session-size">Number of shots</label>
        <div className="pxr-select-wrap">
          <select
            id="session-size"
            className="pxr-select"
            value={sessionSize}
            onChange={onSessionSizeChange}
            disabled={isSessionLocked}
            title={isSessionLocked ? 'Shot count is locked for this session.' : 'Choose how many shots you want'}
          >
            {shotOptions.map((option) => (
              <option key={option} value={option}>
                {option} shots
              </option>
            ))}
          </select>
          <span className="pxr-select-arrow" aria-hidden="true" />
        </div>
      </div>

      <div className="pxr-viewfinder">
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
        <button type="button" className="pxr-btn pxr-btn--primary" onClick={onStartCountdown}>
          Start
        </button>
      )}
    </PhotoboothShell>
  );
}

export default CameraScreen;