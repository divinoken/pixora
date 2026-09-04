import { useRef, useState } from 'react';
import LandingPage from './pages/LandingPage';
import CameraScreen from './pages/CameraScreen';
import ReviewScreen from './pages/ReviewScreen';
import GalleryScreen from './pages/GalleryScreen';
import FinalStripScreen from './pages/FinalStripScreen';

const SESSION_OPTIONS = [4, 6, 8];

function App() {
  const cameraRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionSize, setSessionSize] = useState(4);
  const [countdownResetKey, setCountdownResetKey] = useState(0);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [shots, setShots] = useState([]);
  const [selectedShotId, setSelectedShotId] = useState(null);
  const [showFinalStrip, setShowFinalStrip] = useState(false);
  const [sessionLocked, setSessionLocked] = useState(false);

  const maxShots = sessionSize;
  const isSessionFull = shots.length >= maxShots;
  const canStartNewShot = !isSessionFull || Boolean(capturedPhoto);
  const selectedShot = shots.find((shot) => shot.id === selectedShotId) || shots[shots.length - 1] || null;

  async function handleCountdownComplete() {
    if (!cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.capturePhoto();

    if (photo) {
      setCapturedPhoto(photo);
      setIsCountdownActive(false);
    }
  }

  function handleRetake() {
    setCapturedPhoto(null);
    setSessionLocked(true);
    setIsCountdownActive(true);
    setCountdownResetKey((prev) => prev + 1);
  }

  function handleKeep() {
    if (!capturedPhoto || isSessionFull) {
      return;
    }

    const nextShotCount = shots.length + 1;
    const shouldAutoStart = nextShotCount < maxShots;

    const newShot = {
      id: Date.now(),
      src: capturedPhoto,
    };

    setShots((prevShots) => [...prevShots, newShot]);
    setSelectedShotId(newShot.id);
    setCapturedPhoto(null);
    setSessionLocked(true);
    setIsCountdownActive(shouldAutoStart);
    setCountdownResetKey((prev) => prev + 1);
  }

  function startAnotherShot() {
    if (isSessionFull) {
      return;
    }

    setSessionLocked(true);
    setIsCountdownActive(true);
    setCountdownResetKey((prev) => prev + 1);
  }

  function resetSession() {
    setHasStarted(false);
    setSessionLocked(false);
    setShots([]);
    setSelectedShotId(null);
    setCapturedPhoto(null);
    setShowFinalStrip(false);
    setIsCountdownActive(false);
    setCountdownResetKey((prev) => prev + 1);
  }

  function handleRetakeLastShot() {
    if (shots.length === 0) {
      return;
    }

    const nextShots = shots.slice(0, -1);
    setShots(nextShots);
    setSelectedShotId(nextShots[nextShots.length - 1]?.id ?? null);
    setCapturedPhoto(null);
    setShowFinalStrip(false);
    setSessionLocked(false);
    setIsCountdownActive(false);
    setCountdownResetKey((prev) => prev + 1);
  }

  function handleRetakeAll() {
    setShots([]);
    setSelectedShotId(null);
    setCapturedPhoto(null);
    setShowFinalStrip(false);
    setSessionLocked(false);
    setIsCountdownActive(false);
    setCountdownResetKey((prev) => prev + 1);
  }

  function handleProceedToFinalStrip() {
    setShowFinalStrip(true);
  }

  function handleBackToGallery() {
    setShowFinalStrip(false);
  }

  function handleSessionSizeChange(event) {
    if (sessionLocked) {
      return;
    }

    const nextSize = Number(event.target.value);
    setSessionSize(nextSize);
    setShots([]);
    setSelectedShotId(null);
    setCapturedPhoto(null);
    setIsCountdownActive(false);
    setCountdownResetKey((prev) => prev + 1);
  }

  function handleStartSession() {
    setHasStarted(true);
    setSessionLocked(false);
    setShowFinalStrip(false);
    setIsCountdownActive(false);
    setCountdownResetKey((prev) => prev + 1);
  }

  function handleStartCountdown() {
    if (!canStartNewShot) {
      return;
    }

    setSessionLocked(true);
    setIsCountdownActive(true);
    setCountdownResetKey((prev) => prev + 1);
  }

  if (!hasStarted) {
    return <LandingPage onStart={handleStartSession} />;
  }

  if (showFinalStrip) {
    return (
      <FinalStripScreen
        shots={shots}
        onBackToGallery={handleBackToGallery}
        onRetakeLast={handleRetakeLastShot}
        onRetakeAll={handleRetakeAll}
      />
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '24px' }}>
      <h1>Pixora</h1>

      {capturedPhoto ? (
        <ReviewScreen
          capturedPhoto={capturedPhoto}
          onKeep={handleKeep}
          onRetake={handleRetake}
        />
      ) : (
        <CameraScreen
          cameraRef={cameraRef}
          onCountdownComplete={handleCountdownComplete}
          countdownResetKey={countdownResetKey}
          sessionSize={sessionSize}
          onSessionSizeChange={handleSessionSizeChange}
          isCountdownActive={isCountdownActive}
          onStartCountdown={handleStartCountdown}
          onRetakeLast={handleRetakeLastShot}
          isSessionLocked={sessionLocked}
          canStartNewShot={canStartNewShot}
          isSessionFull={isSessionFull}
        />
      )}

      {shots.length > 0 && (
        <GalleryScreen
          shots={shots}
          selectedShot={selectedShot}
          onSelectShot={setSelectedShotId}
          onTakeAnotherShot={startAnotherShot}
          isSessionFull={isSessionFull}
          maxShots={maxShots}
          onResetSession={handleProceedToFinalStrip}
        />
      )}
    </div>
  );
}

export default App;
