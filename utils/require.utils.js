
import { fileURLToPath } from 'url';
import path from 'path';

// get __filename
// pass in import.meta.url
export const getFilename = (url) => { return fileURLToPath(url); };

// get __dirname
// pass in import.meta.url
export const getDirname = (url) => { return path.dirname(getFilename(url)); };

export const getScriptName = (url) => { return path.basename(getFilename(url)); };
