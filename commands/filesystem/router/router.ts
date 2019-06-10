import fs from 'fs';
import {
    backupFile,
    getControllersNames,
    getMainRouterContent,
    initializeNunjucks,
} from './helper';

const targetFilePath = `${process.cwd()}/src/router.ts`;

if (process.argv.slice(2).includes('--backup')) {
    const backupFilePath = `${process.cwd()}/src/_router.ts`;
    backupFile(targetFilePath, backupFilePath);
}

initializeNunjucks();
const mainRouterContent = getMainRouterContent(getControllersNames());

// Write in the main router file
fs.writeFileSync(targetFilePath, mainRouterContent);
