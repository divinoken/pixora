import PhotoboothShell from '../components/PhotoboothShell';

const pad = (n) => String(n).padStart(2, '0');

function GalleryScreen({
  shots,
  selectedShot,
  onSelectShot,
  onTakeAnotherShot,
  isSessionFull,
  maxShots,
  onResetSession,
  onBrandClick,
}) {
  const selectedIndex = shots.findIndex((shot) => shot.id === selectedShot?.id);

  return (
    <PhotoboothShell readout={`${shots.length} / ${maxShots} shots`} onBrandClick={onBrandClick}>
      <div className="pxr-heading">
        <span className="pxr-eyebrow">Session</span>
        <h1 className="pxr-title">{isSessionFull ? 'All shots taken' : 'Shot saved'}</h1>
      </div>

      <div className="pxr-gallery">
        <div className="pxr-gallery-preview">
          {selectedShot && (
            <>
              <div className="pxr-preview">
                <img src={selectedShot.src} alt={`Shot ${selectedIndex + 1}`} />
              </div>
              <p className="pxr-note">
                SHOT {pad(selectedIndex + 1)} OF {pad(shots.length)}
              </p>
            </>
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
              aria-label={`View shot ${index + 1}`}
            >
              <img src={shot.src} alt="" />
            </button>
          ))}
        </div>
      </div>

      <div className="pxr-bar">
        <p className="pxr-note">
          {isSessionFull
            ? `Session full · ${maxShots} shots`
            : `${shots.length} of ${maxShots} shots taken`}
        </p>
        {isSessionFull ? (
          <button type="button" className="pxr-btn pxr-btn--primary" onClick={onResetSession}>
            See your strip
          </button>
        ) : (
          <button type="button" className="pxr-btn pxr-btn--primary" onClick={onTakeAnotherShot}>
            Next shot
          </button>
        )}
      </div>
    </PhotoboothShell>
  );
}

export default GalleryScreen;