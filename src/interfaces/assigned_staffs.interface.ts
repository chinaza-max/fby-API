export default interface IAssignedStaffs {
    id: number;
    job_id: number;
    staff_id: number;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
}
