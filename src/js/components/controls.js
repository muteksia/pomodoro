import { timer } from '../utils/timer.js';
import { timerDisplay } from './timerDisplay.js';
import store from '../store.js';
import { skipSession } from './sessionCycle.js';

const btnToggle = document.getElementById('btn-toggle');
const btnReset = document.getElementById('btn-reset');
const btnSkip = document.getElementById('btn-skip');
const toggleIcon = document.getElementById('btn-toggle-icon');
const toggleLabel = document.getElementById('btn-toggle-label');

const updateToggleButton = () => {
    const isRunning = timer.getIsRunning();
    toggleIcon.textContent = isRunning ? 'pause' : 'play_arrow';
    toggleLabel.textContent = isRunning ? 'Pause' : 'Start';
};

import { playTick } from '../utils/sound.js';

const toggleTimer = () => {
    if (timer.getIsRunning()) {
        timer.pause();
    } else {
        timer.start();
        playTick();
    }
    updateToggleButton();
};

const resetTimer = () => {
    const { mode } = store.getState();
    timer.reset(timerDisplay.getModeDuration(mode));
    updateToggleButton();
};

const skipPhase = () => {
    skipSession();
    updateToggleButton();
};

const init = () => {
    btnToggle.addEventListener('click', toggleTimer);
    btnReset.addEventListener('click', resetTimer);
    btnSkip.addEventListener('click', skipPhase);
    updateToggleButton();
};

export const controls = { init, toggleTimer, resetTimer, skipPhase, updateToggleButton };
