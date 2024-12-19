import { Process, Metrics } from "../types/escalatorTypes";

export function rr(processes: Process[], quantum: number): Metrics {
    let currentTime = 0;
    let totalResponseTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    const processesSize = processes.length;
    const remainingTimes = processes.map(p => p.burstTime); 
    const responseTimes: number[] = new Array(processesSize).fill(-1);
    const queue: number[] = [];

    let completedProcesses = 0;

    processes.forEach((p, i) => {
        if (p.arrivalTime === 0) queue.push(i);
    });

    while (completedProcesses < processesSize) {
        if (queue.length === 0) {
            currentTime++;
            processes.forEach((p, i) => {
                if (p.arrivalTime === currentTime && remainingTimes[i] > 0) {
                    queue.push(i);
                }
            });
            continue;
        }

        const index = queue.shift()!;

        if (responseTimes[index] === -1) {
            responseTimes[index] = currentTime - processes[index].arrivalTime;
            totalResponseTime += responseTimes[index];
        }

        const executionTime = Math.min(quantum, remainingTimes[index]);
        remainingTimes[index] -= executionTime;
        currentTime += executionTime;

        processes.forEach((p, i) => {
            if (p.arrivalTime <= currentTime && remainingTimes[i] > 0 && !queue.includes(i) && i !== index) {
                queue.push(i);
            }
        });

        if (remainingTimes[index] === 0) {
            completedProcesses++;

            const turnaroundTime = currentTime - processes[index].arrivalTime;
            const waitingTime = turnaroundTime - processes[index].burstTime;

            totalTurnaroundTime += turnaroundTime;
            totalWaitingTime += waitingTime;
        } else {
            queue.push(index);
        }
    }

    return {
        responseTime: totalResponseTime / processesSize,
        waitingTime: totalWaitingTime / processesSize,
        turnaroundTime: totalTurnaroundTime / processesSize,
    };
}
