import { useState } from 'react';
import PhotoboothShell from '../components/PhotoboothShell';

function LandingPage({ onStart }) {
  const [flashing, setFlashing] = useState(false);

  const handleStart = () => {
    if (flashing) return;
    setFlashing(true);

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.setTimeout(onStart, reduced ? 60 : 380);
  };

  return (
    <PhotoboothShell readout="N°001 · f/2.8 · 1/125 · ISO 400">
      <div className={`pxr-flash${flashing ? ' is-active' : ''}`} aria-hidden="true" />

      <div className="pxr-heading">
        <h1 className="pxr-title">Welcome to Pixora!</h1>
        <p className="pxr-sub">Strike a pose. Make it yours.</p>
      </div>

      <button type="button" className="pxr-shutter" onClick={handleStart} aria-label="Start session">
        <span className="pxr-shutter-ring">START</span>
      </button>

      <p className="pxr-note">Choose 1, 2, or 4 shots · auto flash</p>
    </PhotoboothShell>
  );
}

export default LandingPage;