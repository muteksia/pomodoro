export const loadToInputs = (durations) => {
    document.getElementById('input-pomo-m').value = durations.pomodoro.minutes;
    document.getElementById('input-pomo-s').value = durations.pomodoro.seconds;
    document.getElementById('input-short-m').value = durations.short.minutes;
    document.getElementById('input-short-s').value = durations.short.seconds;
    document.getElementById('input-long-m').value = durations.long.minutes;
    document.getElementById('input-long-s').value = durations.long.seconds;
};

export const readFromInputs = () => {
    const pomodoro = {
        minutes: parseInt(document.getElementById('input-pomo-m').value) || 0,
        seconds: parseInt(document.getElementById('input-pomo-s').value) || 0
    };
    const short = {
        minutes: parseInt(document.getElementById('input-short-m').value) || 0,
        seconds: parseInt(document.getElementById('input-short-s').value) || 0
    };
    const long = {
        minutes: parseInt(document.getElementById('input-long-m').value) || 0,
        seconds: parseInt(document.getElementById('input-long-s').value) || 0
    };
    return { pomodoro, short, long };
};

export const validate = () => {
    const { pomodoro, short, long } = readFromInputs();
    const isValid =
        (pomodoro.minutes + pomodoro.seconds > 0) &&
        (short.minutes + short.seconds > 0) &&
        (long.minutes + long.seconds > 0);

    const errorMsg = document.getElementById('duration-error-msg');
    if (!isValid) {
        errorMsg.classList.remove('hidden');
    } else {
        errorMsg.classList.add('hidden');
    }

    return isValid;
};

export const resetDefaults = () => {
    document.getElementById('input-pomo-m').value = '25';
    document.getElementById('input-pomo-s').value = '0';
    document.getElementById('input-short-m').value = '5';
    document.getElementById('input-short-s').value = '0';
    document.getElementById('input-long-m').value = '15';
    document.getElementById('input-long-s').value = '0';
    document.getElementById('duration-error-msg').classList.add('hidden');
};