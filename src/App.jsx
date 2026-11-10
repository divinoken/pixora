import { useRef, useState } from 'react';
import LandingPage from './pages/LandingPage';
import CameraScreen from './pages/CameraScreen';
import ReviewScreen from './pages/ReviewScreen';
import GalleryScreen from './pages/GalleryScreen';
import FinalStripScreen from './pages/FinalStripScreen';

const SHOT_OPTIONS = [1, 2, 4];

// view: landing | camera | review | gallery | strip
function App() {
  const cameraRef = useRef(null);
  const [view, setView] = useState('landing');
  const [sessionSize, setSessionSize] = useState(SHOT_OPTIONS[0]);
  const [sessionLocked, setSessionLocked] = useState(false);
  const [countdownResetKey, setCountdownResetKey] = useState(0);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [shots, setShots] = useState([]);
  const [selectedShotId, setSelectedShotId] = useState(null);

  const maxShots = SHOT_OPTIONS.includes(sessionSize) ? sessionSize : SHOT_OPTIONS[0];
  const isSessionFull = shots.length >= maxShots;
  const selectedShot =
    shots.find((shot) => shot.id === selectedShotId) || shots[shots.length - 1] || null;

  function beginCountdown() {
    setSessionLocked(true);
    setIsCountdownActive(true);
    setCountdownResetKey((prev) => prev + 1);
  }

  function stopCountdown() {
    setIsCountdownActive(false);
    setCountdownResetKey((prev) => prev + 1);
  }

  async function handleCountdownComplete() {
    if (!cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.capturePhoto();

    if (photo) {
      setCapturedPhoto(photo);
      setIsCountdownActive(false);
      setView('review');
    }
  }

  function handleRetake() {
    setCapturedPhoto(null);
    stopCountdown();
    setView('camera');
  }

  function handleKeep() {
    if (!capturedPhoto || isSessionFull) {
      return;
    }

    const newShot = { id: Date.now(), src: capturedPhoto };

    setShots((prev) => [...prev, newShot]);
    setSelectedShotId(newShot.id);
    setCapturedPhoto(null);
    stopCountdown();
    setView('gallery');
  }

  function startAnotherShot() {
    if (isSessionFull) {
      return;
    }

    setView('camera');
    beginCountdown();
  }

  function handleRetakeLast() {
    setShots((prev) => prev.slice(0, -1));
    setSelectedShotId(null);
    setView('camera');
    beginCountdown();
  }

  function handleRetakeAll() {
    setShots([]);
    setSelectedShotId(null);
    setCapturedPhoto(null);
    setSessionLocked(false);
    stopCountdown();
    setView('camera');
  }

  function handleSessionSizeChange(event) {
    if (sessionLocked) {
      return;
    }

    const selectedSize = Number(event.target.value);
    setSessionSize(SHOT_OPTIONS.includes(selectedSize) ? selectedSize : SHOT_OPTIONS[0]);
    setShots([]);
    setSelectedShotId(null);
    setCapturedPhoto(null);
    stopCountdown();
  }

  function handleStartSession() {
    setShots([]);
    setSelectedShotId(null);
    setCapturedPhoto(null);
    setSessionLocked(false);
    stopCountdown();
    setView('camera');
  }

  function handleGoToLanding() {
    setShots([]);
    setSelectedShotId(null);
    setCapturedPhoto(null);
    setSessionLocked(false);
    stopCountdown();
    setView('landing');
  }

  switch (view) {
    case 'landing':
      return <LandingPage onStart={handleStartSession} />;

    case 'review':
      return (
        <ReviewScreen
          capturedPhoto={capturedPhoto}
          onKeep={handleKeep}
          onRetake={handleRetake}
          onBrandClick={handleGoToLanding}
        />
      );

    case 'gallery':
      return (
        <GalleryScreen
          shots={shots}
          selectedShot={selectedShot}
          onSelectShot={setSelectedShotId}
          onTakeAnotherShot={startAnotherShot}
          isSessionFull={isSessionFull}
          maxShots={maxShots}
          onResetSession={() => setView('strip')}
          onBrandClick={handleGoToLanding}
        />
      );

    case 'strip':
      return (
        <FinalStripScreen
          shots={shots}
          onBackToGallery={() => setView('gallery')}
          onRetakeLast={handleRetakeLast}
          onRetakeAll={handleRetakeAll}
          onBrandClick={handleGoToLanding}
        />
      );

    default:
      return (
        <CameraScreen
          cameraRef={cameraRef}
          onCountdownComplete={handleCountdownComplete}
          countdownResetKey={countdownResetKey}
          sessionSize={maxShots}
          onSessionSizeChange={handleSessionSizeChange}
          isCountdownActive={isCountdownActive}
          onStartCountdown={beginCountdown}
          isSessionLocked={sessionLocked}
          shotsTaken={shots.length}
          onBrandClick={handleGoToLanding}
          shotOptions={SHOT_OPTIONS}
        />
      );
  }
}

export default App;