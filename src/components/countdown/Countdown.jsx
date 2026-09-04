import { useState, useEffect } from 'react';

function Countdown({ onComplete, isActive = true, resetKey = 0 }) {
    const [count, setCount] = useState(5);

    useEffect(() => {
        setCount(5);
    }, [resetKey]);

    useEffect(() => {
        if (!isActive) {
            return undefined;
        }

        if (count === 0) {
            onComplete();
            return undefined;
        }

        const timer = setTimeout(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [count, isActive, onComplete]);

    return (
        <div>
            <h2>{isActive ? count : 0}</h2>
        </div>
    );
}

export default Countdown;