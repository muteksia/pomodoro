export const timer = (() => {
    let remainingSeconds = 1500;
    let isRunning = false;
    let intervalId = null;
    let onTick = null;

    const notify = () => {
        if (onTick) onTick(remainingSeconds);
    };

    const start = () => {
        if (isRunning || remainingSeconds <= 0) return;
        isRunning = true;
        intervalId = setInterval(() => {
            remainingSeconds -= 1;
            notify();
            if (remainingSeconds <= 0) pause();
        }, 1000);
    };

    const pause = () => {
        isRunning = false;
        clearInterval(intervalId);
        intervalId = null;
    };

    const reset = (seconds) => {
        pause();
        remainingSeconds = seconds;
        notify();
    };

    const setOnTick = (handler) => {
        onTick = handler;
    };

    const getRemainingSeconds = () => remainingSeconds;
    const getIsRunning = () => isRunning;

    return { start, pause, reset, setOnTick, getRemainingSeconds, getIsRunning };
})();
