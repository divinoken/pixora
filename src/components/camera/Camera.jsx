import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const Camera = forwardRef(function Camera(props, ref) {
    const videoRef = useRef(null);

    useEffect(() => {
        async function startCamera() {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    console.error('Camera API is not supported in this browser.');
                    return;
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Camera access denied:', error);
            }
        }

        startCamera();
    }, []);

    useImperativeHandle(ref, () => ({
        capturePhoto: async () => {
            if (!videoRef.current) {
                return null;
            }

            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            return canvas.toDataURL('image/png');
        },
    }));

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000000',
                overflow: 'hidden',
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'cover',
                    background: '#000000',
                }}
            />
        </div>
    );
});

export default Camera;