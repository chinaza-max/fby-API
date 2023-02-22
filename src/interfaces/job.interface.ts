import { JobStatus, JobTypes } from "./types.interface";

export default interface IJob {
    id: number;
    description: string;
    time_zone:string;
    customer_id: number;
    facility_id: number;
    job_status: JobStatus;
    client_charge: number;
    staff_charge: number;
    job_type: JobTypes;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    max_check_in_time:string;
    created_by_id: number;
    is_deleted:boolean;

}
