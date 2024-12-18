import { Process, Metrics } from "../types/escalatorTypes";

export function fifo(processes: Process[]): Metrics {

    let currentTime: number = 0;
    let totalResponseTime: number = 0;
    let totalWaitingTime: number = 0;
    let totalTurnaroundTime: number = 0;

    const processesSize: number = processes.length;

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    for (let process of processes) {

        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime;
        }

        process.startTime = currentTime;
        process.endTime = currentTime + process.burstTime;
        totalResponseTime += process.startTime - process.arrivalTime;
        totalWaitingTime += process.startTime - process.arrivalTime;
        totalTurnaroundTime += process.endTime - process.arrivalTime;
        currentTime = process.endTime;
    }

    return {
        responseTime: totalResponseTime / processesSize,
        turnaroundTime: totalTurnaroundTime / processesSize,
        waitingTime: totalWaitingTime / processesSize
    };
}