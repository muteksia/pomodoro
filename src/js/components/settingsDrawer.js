const openDrawer = () => {
    const backdrop = document.getElementById('settings-backdrop');
    const drawer = document.getElementById('settings-drawer');
    const openBtn = document.getElementById('open-settings-btn');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    openBtn.setAttribute('aria-expanded', 'true');
};

const closeDrawer = () => {
    const backdrop = document.getElementById('settings-backdrop');
    const drawer = document.getElementById('settings-drawer');
    const openBtn = document.getElementById('open-settings-btn');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    drawer.classList.add('translate-x-full');
    drawer.classList.remove('translate-x-0');
    openBtn.setAttribute('aria-expanded', 'false');
};

const isOpen = () => {
    const drawer = document.getElementById('settings-drawer');
    return !drawer.classList.contains('translate-x-full');
};

const init = () => {
    const openBtn = document.getElementById('open-settings-btn');
    const closeBtn = document.getElementById('close-settings-btn');
    const backdrop = document.getElementById('settings-backdrop');

    openBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen()) {
            closeDrawer();
        }
    });
};

export { openDrawer, closeDrawer, isOpen, init };