export default interface ISchedule {
    _id: number;
    start_time: string;
    end_time: string;
    job_id: number;
    schedule_length: string;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
}
