import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const ASPECT = 4 / 3;

function waitForVideo(video, timeout = 3000) {
  return new Promise((resolve) => {
    if (video.readyState >= 2 && video.videoWidth) {
      resolve();
      return;
    }
    const finish = () => {
      clearTimeout(timer);
      video.removeEventListener('loadeddata', finish);
      resolve();
    };
    const timer = setTimeout(finish, timeout);
    video.addEventListener('loadeddata', finish);
  });
}

const Camera = forwardRef(function Camera(_props, ref) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | blocked

  useEffect(() => {
    let stream = null;
    let cancelled = false;

    async function startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus('blocked');
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Camera access denied:', error);
        if (!cancelled) {
          setStatus('blocked');
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    capturePhoto: async () => {
      const video = videoRef.current;
      if (!video) {
        return null;
      }

      await waitForVideo(video);

      const videoWidth = video.videoWidth || 640;
      const videoHeight = video.videoHeight || 480;

      // Center-crop to 4:3 so the photo matches what the viewfinder shows.
      let sourceWidth = videoWidth;
      let sourceHeight = videoWidth / ASPECT;
      if (sourceHeight > videoHeight) {
        sourceHeight = videoHeight;
        sourceWidth = videoHeight * ASPECT;
      }
      const sourceX = (videoWidth - sourceWidth) / 2;
      const sourceY = (videoHeight - sourceHeight) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(sourceWidth);
      canvas.height = Math.round(sourceHeight);

      const context = canvas.getContext('2d');
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(
        video,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      return canvas.toDataURL('image/jpeg', 0.92);
    },
  }), []);

  return (
    <div className="pxr-camera">
      <video
        ref={videoRef}
        className="pxr-camera-video"
        autoPlay
        playsInline
        muted
        onLoadedData={() => setStatus('ready')}
      />
      {status === 'ready' && <p className="pxr-camera-hint">Please look at the camera.</p>}
      {status === 'blocked' && (
        <p className="pxr-camera-msg">
          Camera unavailable. Allow camera access in your browser settings, then reload the page.
        </p>
      )}
    </div>
  );
});

export default Camera;