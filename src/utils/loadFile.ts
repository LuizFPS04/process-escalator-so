import * as fs from 'fs';

export function readFile(filePath: string): string[] {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.split(/\r?\n/).filter(line => line.trim() !== '');
}

export function writeFile(filePath: string, content: string[]): void {
    fs.writeFileSync(filePath, content.join('\n'), 'utf-8');
}

export function getTestFiles(directory: string): string[] {
    return fs.readdirSync(directory)
        .filter(file => file.startsWith('TESTE-') && file.endsWith('.txt'));
}