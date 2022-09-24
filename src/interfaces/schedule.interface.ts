import { ScheduleLengthTypes } from "./types.interface";

export default interface ISchedule {
    id: number;
    start_time: string;
    end_time: string;
    check_in_date: Date;
    job_id: number;
    schedule_length: ScheduleLengthTypes;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
}
