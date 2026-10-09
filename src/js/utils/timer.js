export const timer = (() => {
    let remainingSeconds = 1500;
    let isRunning = false;
    let intervalId = null;
    let onTick = null;
    let onComplete = null;

    const notify = () => {
        if (onTick) onTick(remainingSeconds);
    };

    const start = () => {
        if (isRunning || remainingSeconds <= 0) return;
        isRunning = true;
        intervalId = setInterval(() => {
            remainingSeconds -= 1;
            notify();
            if (remainingSeconds <= 0) { pause(); complete(); }
        }, 1000);
    };

    const pause = () => {
        isRunning = false;
        clearInterval(intervalId);
        intervalId = null;
    };
    const complete = () => {
        if (onComplete) onComplete();
    };

    const reset = (seconds) => {
        pause();
        remainingSeconds = seconds;
        notify();
    };

    const setOnTick = (handler) => {
        onTick = handler;
    };
    const setOnComplete = (handler) => {
        onComplete = handler;
    };

    const getRemainingSeconds = () => remainingSeconds;
    const getIsRunning = () => isRunning;

    return { start, pause, reset, setOnTick, setOnComplete, getRemainingSeconds, getIsRunning };
})();
