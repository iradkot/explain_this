import fs from 'fs';
import clipboardy from 'clipboardy';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}


async function copyFilesToClipboard(directoryPath, fileEntries = []) {
    const items = await fs.promises.readdir(directoryPath);

    for (const item of items) {
        const itemPath = `${directoryPath}/${item}`;
        const itemStat = await fs.promises.stat(itemPath);

        if (itemStat.isFile()) {
            const fileContent = await fs.promises.readFile(itemPath, 'utf-8');
            fileEntries.push(`${itemPath}\n${fileContent}\n`);
        } else if (itemStat.isDirectory()) {
            const answer = await ask(`Do you want to copy the contents of the folder "${itemPath}"? (y/n): `);
            if (answer.toLowerCase() === 'y') {
                await copyFilesToClipboard(itemPath, fileEntries);
            }
        }
    }

    return fileEntries;
}

// Usage example
const directoryPath = '/Users/iradkotton/projects/side-projects/shaniDms22/src/components/CgmCardListDisplay/TimeScale';
copyFilesToClipboard(directoryPath)
    .then((fileEntries) => {
        const clipboardContent = fileEntries.join('\n');
        clipboardy.writeSync(clipboardContent);
        console.log('Files and their contents copied to clipboard:', fileEntries);
    })
    .catch((err) => {
        console.error('Failed to read file or copy to clipboard:', err);
    });


