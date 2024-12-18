export interface Process {
    arrivalTime: number;
    burstTime: number;
    remainingTime?: number;
    startTime?: number;
    endTime?: number;
}

export interface Metrics {
    responseTime: number;
    waitingTime: number;
    turnaroundTime: number;
}