import * as fs from 'fs';
import { Metrics, Process } from '../types/escalatorTypes';

export function readFile(filePath: string): { quantum: number; processes: Process[] } {
    const data = fs.readFileSync(filePath, 'utf8').trim().split('\n');
    const quantum = parseInt(data[0]);

    const processes: Process[] = data.slice(1).map(line => {
        const [arrivalTime, burstTime] = line.split(' ').map(Number);
        return { arrivalTime, burstTime, remainingTime: burstTime };
    });

    return { quantum, processes };
}

export function writeFile(filePath: string, metrics: Metrics[]): void {
    const output = metrics.map(m => 
        `${m.responseTime.toFixed(3).replace('.', ',')} ` +
        `${m.waitingTime.toFixed(3).replace('.', ',')} ` +
        `${m.turnaroundTime.toFixed(3).replace('.', ',')}`
    ).join('\n');

    fs.writeFileSync(filePath, output, 'utf8');
}

export function getTestFiles(directory: string): string[] {
    return fs.readdirSync(directory)
        .filter(file => file.startsWith('TESTE-') && file.endsWith('.txt'));
}