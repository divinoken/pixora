import { useState, useEffect, useRef } from 'react';

function Countdown({ onComplete, isActive = true, resetKey = 0, from = 5 }) {
  const [count, setCount] = useState(from);
  const onCompleteRef = useRef(onComplete);

  // Keep the latest callback without restarting the timer when the parent re-renders.
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setCount(from);
  }, [resetKey, from]);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    if (count === 0) {
      onCompleteRef.current();
      return undefined;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="pxr-countdown" role="timer" aria-live="assertive">
      {count > 0 ? (
        <span key={count} className="pxr-countdown-number">
          {count}
        </span>
      ) : (
        <span className="pxr-countdown-flash" />
      )}
    </div>
  );
}

export default Countdown;