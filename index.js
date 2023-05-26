import fs from 'fs';

async function copyFilesToClipboard(directoryPath) {
    fs.readdir(directoryPath, async (err, files) => {
        if (err) {
            console.error('Unable to read directory:', err);
            return;
        }

        const filePaths = files.map((file) => `${directoryPath}/${file}`);

        // Joining file names and paths with newlines
        const clipboardContent = filePaths.join('\n');

        try {
            const clipboardy = await import('clipboardy');
            clipboardy.writeSync(clipboardContent);
            console.log('Files copied to clipboard:', filePaths);
        } catch (err) {
            console.error('Failed to import clipboardy:', err);
        }
    });
}

// Usage example
const directoryPath = '/path/to/directory';
copyFilesToClipboard(directoryPath);
