import { Process, Metrics } from "../types/escalatorTypes";

export function srt(processes: Process[]): Metrics {

    let currentTime: number = 0;
    let totalResponseTime: number = 0;
    let totalWaitingTime: number = 0;
    let totalTurnaroundTime: number = 0;

    const processesSize = processes.length;
    let completedProcesses = 0;
    const remainingTimes = processes.map(p => p.burstTime);
    const responseTimes: number[] = new Array(processesSize).fill(-1);

    while (completedProcesses < processesSize) {
        let shortestIndex = -1;

        for (let i = 0; i < processesSize; i++) {
            if (
                processes[i].arrivalTime <= currentTime &&
                remainingTimes[i] > 0 && 
                (shortestIndex === -1 || remainingTimes[i] < remainingTimes[shortestIndex])
            ) {
                shortestIndex = i;
            }
        }

        if (shortestIndex === -1) {
            currentTime++;
            continue;
        }

        if (responseTimes[shortestIndex] === -1) {
            responseTimes[shortestIndex] = currentTime - processes[shortestIndex].arrivalTime;
        }

        remainingTimes[shortestIndex]--;
        currentTime++;

        if (remainingTimes[shortestIndex] === 0) {
            completedProcesses++;

            const turnaroundTime = currentTime - processes[shortestIndex].arrivalTime;
            const waitingTime = turnaroundTime - processes[shortestIndex].burstTime;

            totalResponseTime += responseTimes[shortestIndex];
            totalTurnaroundTime += turnaroundTime;
            totalWaitingTime += waitingTime;
        }
    }

    return {
        responseTime: totalResponseTime / processesSize,
        waitingTime: totalWaitingTime / processesSize,
        turnaroundTime: totalTurnaroundTime / processesSize
    };
}
