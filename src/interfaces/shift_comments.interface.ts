
export default interface IShift_comments {
    id: number;
    created_by_id: number;
    schedule_id: number;
    comment:string;
    time_zone:string;
    reference_date: Date;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    is_deleted:boolean;
}
