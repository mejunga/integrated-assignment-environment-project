import path from 'path';
import { app } from 'electron';
import { isDev } from './electronUtils.js';

export function getPreloadPath() {
    return path.join(
        app.getAppPath(),
        isDev() ? '.': '..',
        'dist_electron', 'preload.cjs'
    );
}

export function getDataPath() {
    return path.join(
        app.getAppPath(),
        '..',
        isDev() ? '.': '..',
        'data'
    );
}

export function getUserManualPath() {
    return path.join(
        getDataPath(), 'user_manual.pdf'
    );
}