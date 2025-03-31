export interface IIsSchedule {
    isSchedule?: boolean;
    schedule: ISchedule;
}

export interface ISchedule {
    initialDate: string;
    finalDate: string;
}
