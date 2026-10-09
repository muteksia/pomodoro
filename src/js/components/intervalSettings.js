const MIN_INTERVAL = 2;
const MAX_INTERVAL = 12;
const DEFAULT_INTERVAL = 4;

let intervalValue = DEFAULT_INTERVAL;
let onIntervalChange = null;

const renderDisplay = () => {
    const el = document.getElementById('interval-display-val');
    if (el) {
        el.textContent = intervalValue;
    }
};

const applyChange = () => {
    renderDisplay();
    if (onIntervalChange) {
        onIntervalChange(intervalValue);
    }
};

export const getInterval = () => intervalValue;

export const setOnChange = (handler) => {
    onIntervalChange = handler;
};

export const render = renderDisplay;

export const increment = () => {
    if (intervalValue < MAX_INTERVAL) {
        intervalValue += 1;
        applyChange();
    }
};

export const decrement = () => {
    if (intervalValue > MIN_INTERVAL) {
        intervalValue -= 1;
        applyChange();
    }
};

export const resetDefaults = () => {
    intervalValue = DEFAULT_INTERVAL;
    applyChange();
};
