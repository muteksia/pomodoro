import store from '../store.js';

export const modeTabs = (() => {
    const tabsContainer = document.querySelector('[role="tablist"]');
    const tabs = tabsContainer?.querySelectorAll('[role="tab"]');

    const setActiveTab = (mode) => {
        tabs?.forEach((tab) => {
            const isActive = tab.dataset.mode === mode;
            tab.setAttribute('aria-selected', isActive);
            tab.classList.toggle('bg-surface-container-high', isActive);
            tab.classList.toggle('text-on-surface', isActive);
            tab.classList.toggle('shadow-sm', isActive);
            tab.classList.toggle('text-on-surface-variant', !isActive);
            tab.classList.toggle('hover:text-on-surface', !isActive);
            tab.classList.toggle('hover:bg-surface-container-high/40', !isActive);

            const indicator = tab.querySelector('span:first-child');
            if (indicator) {
                indicator.classList.toggle('opacity-0', !isActive);
                indicator.classList.toggle('scale-100', isActive);
            }
        });
    };

    const init = () => {
        setActiveTab(store.getState().mode);
    };

    const getCurrentMode = () => store.getState().mode;

    return { init, getCurrentMode, setActiveTab };
})();
