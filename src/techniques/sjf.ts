import { Process, Metrics } from "../types/escalatorTypes";

export function sjf(processes: Process[]): Metrics {

    let currentTime: number = 0;
    let totalResponseTime: number = 0;
    let totalWaitingTime: number = 0;
    let totalTurnaroundTime: number = 0;

    const processesSize: number = processes.length;
    const readyQueue: Process[] = [];
    const remainingProcesses = [...processes];

    remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (remainingProcesses.length > 0 || readyQueue.length > 0) {
        while (
            remainingProcesses.length > 0 &&
            remainingProcesses[0].arrivalTime <= currentTime
        ) {
            readyQueue.push(remainingProcesses.shift()!);
        }

        readyQueue.sort((a, b) => a.burstTime - b.burstTime);

        if (readyQueue.length > 0) {
            const process = readyQueue.shift()!;

            if (currentTime < process.arrivalTime) {
                currentTime = process.arrivalTime;
            }

            process.startTime = currentTime;
            process.endTime = currentTime + process.burstTime;

            totalResponseTime += process.startTime - process.arrivalTime;
            totalWaitingTime += process.startTime - process.arrivalTime;
            totalTurnaroundTime += process.endTime - process.arrivalTime;

            currentTime = process.endTime;
        } else {
            currentTime = remainingProcesses[0].arrivalTime;
        }
    }

    return {
        responseTime: totalResponseTime / processesSize,
        waitingTime: totalWaitingTime / processesSize,
        turnaroundTime: totalTurnaroundTime / processesSize,
    };
}
