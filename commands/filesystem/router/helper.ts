import fs from 'fs';
import nunjucks from 'nunjucks';
import path from 'path';

export function backupFile(targetPath: string, backupPath: string) {
    try {
        // Backup the current router file
        fs.copyFileSync(targetPath, backupPath);
    } catch (error) {
        console.log('No router file found => No backup needed.');
    }
}

export function getRoutesNames() {
    const filenames = fs.readdirSync(`${process.cwd()}/src/routes`);

    return filenames.map((filename) => filename.replace('.ts', ''));
}

export function initializeNunjucks() {
    nunjucks.configure(path.join(__dirname), { autoescape: true });
}
export function getMainRouterContent(routes: string[]) {
    return nunjucks.render('router.tpl', { routes });
}
