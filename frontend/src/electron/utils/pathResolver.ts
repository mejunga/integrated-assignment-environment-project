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