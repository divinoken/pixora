import PhotoboothShell from '../components/PhotoboothShell';

function ReviewScreen({ capturedPhoto, onKeep, onRetake, onBrandClick }) {
  return (
    <PhotoboothShell readout="REVIEW" onBrandClick={onBrandClick}>
      <div className="pxr-polaroid">
        <img src={capturedPhoto} alt="Captured preview" />
      </div>

      <div className="pxr-actions">
        <button type="button" className="pxr-btn pxr-btn--primary" onClick={onKeep}>
          Keep
        </button>
        <button type="button" className="pxr-btn pxr-btn--ghost" onClick={onRetake}>
          Retake
        </button>
      </div>
    </PhotoboothShell>
  );
}

export default ReviewScreen;