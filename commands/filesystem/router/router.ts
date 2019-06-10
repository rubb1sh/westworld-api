import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';

const targetFilePath = `${process.cwd()}/src/router.ts`;

if (process.argv.slice(2).includes('--backup')) {
    const backupFilePath = `${process.cwd()}/src/_router.ts`;

    try {
        // Backup the current router file
        fs.copyFileSync(targetFilePath, backupFilePath);
    } catch (error) {
        console.log('No router file found => No backup needed.');
    }
}

// Initialize Nunjucks
nunjucks.configure(path.join(__dirname), { autoescape: true });

// Get the controllers names
const filenames = fs.readdirSync(`${process.cwd()}/src/controllers`);
const controllers = filenames.map((filename) => filename.replace('.ts', ''));

// Render the main router content
const fileContent = nunjucks.render('router.tpl', { controllers });

// Write in the main router file
fs.writeFileSync(targetFilePath, fileContent);
