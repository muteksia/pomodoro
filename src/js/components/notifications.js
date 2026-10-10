import { i18n } from '../i18n/i18n.js';

export const requestPermission = async () => {
    if (!('Notification' in window)) return false;
    const perm = await Notification.requestPermission();
    return perm === 'granted';
};

export const syncStatus = () => {
    const indicator = document.getElementById('notif-indicator');
    const badge = document.getElementById('notif-status-badge');
    const quickBtn = document.getElementById('quick-enable-notif');
    const drawerBtn = document.getElementById('drawer-request-notif-btn');
    const granted = Notification.permission === 'granted';
    if (granted) {
        if (indicator) {
            indicator.classList.remove('bg-surface-container-highest');
            indicator.classList.add('bg-primary');
        }
        if (badge) badge.textContent = i18n.t('footer.notification.statusActive');
        if (quickBtn) quickBtn.style.display = 'none';
        if (drawerBtn) {
            drawerBtn.disabled = true;
            const span = drawerBtn.querySelector('span');
            if (span) span.textContent = i18n.t('settings.notifications.granted');
        }
    } else {
        if (indicator) {
            indicator.classList.remove('bg-primary');
            indicator.classList.add('bg-surface-container-highest');
        }
        if (badge) badge.textContent = i18n.t('footer.notification.statusNotActive');
        if (quickBtn) quickBtn.style.display = 'inline';
        if (drawerBtn) {
            drawerBtn.disabled = false;
            const span = drawerBtn.querySelector('span');
            if (span) span.textContent = i18n.t('settings.notifications.requestPermission');
        }
    }
};

export const init = () => {
    syncStatus();
    document.getElementById('quick-enable-notif')?.addEventListener('click', async () => {
        const granted = await requestPermission();
        if (granted) syncStatus();
    });
    document.getElementById('drawer-request-notif-btn')?.addEventListener('click', async () => {
        const granted = await requestPermission();
        if (granted) syncStatus();
    });
};

