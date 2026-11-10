const SPROCKETS = Array.from({ length: 14 });

function Sprockets() {
  return (
    <div className="pxr-sprockets" aria-hidden="true">
      {SPROCKETS.map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

function PhotoboothShell({ readout, onBrandClick, children }) {
  return (
    <div className="pxr-page">
      <Sprockets />
      <header className="pxr-header">
        <button type="button" className="pxr-brand" onClick={onBrandClick} aria-label="Return to Pixora home">
          PIXORA
        </button>
        {readout && <span className="pxr-readout">{readout}</span>}
      </header>
      <main className="pxr-main">{children}</main>
      <Sprockets />
    </div>
  );
}

export default PhotoboothShell;