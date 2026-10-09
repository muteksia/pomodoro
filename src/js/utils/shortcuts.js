import { controls } from '../components/controls.js';

const isInputFocused = () => {
    const activeElement = document.activeElement;
    return activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
};

const setDrawerOpen = (isOpen) => {
    const backdrop = document.getElementById('settings-backdrop');
    const drawer = document.getElementById('settings-drawer');
    backdrop.classList.toggle('opacity-0', !isOpen);
    backdrop.classList.toggle('pointer-events-none', !isOpen);
    backdrop.classList.toggle('opacity-100', isOpen);
    backdrop.classList.toggle('pointer-events-auto', isOpen);
    drawer.classList.toggle('translate-x-full', !isOpen);
    drawer.classList.toggle('translate-x-0', isOpen);
};

const isDrawerOpen = () => !document.getElementById('settings-drawer').classList.contains('translate-x-full');

const handleKeydown = (event) => {
    if (isInputFocused()) return;

    switch (event.key.toLowerCase()) {
        case ' ':
            event.preventDefault();
            controls.toggleTimer();
            break;
        case 'r':
            controls.resetTimer();
            break;
        case 'l':
            controls.skipPhase();
            break;
        case 'p':
            setDrawerOpen(!isDrawerOpen());
            break;
        case 'escape':
            setDrawerOpen(false);
            break;
        default:
            break;
    }
};

document.addEventListener('keydown', handleKeydown);

export { handleKeydown };