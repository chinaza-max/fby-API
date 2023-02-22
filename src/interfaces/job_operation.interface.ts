export default interface IJobOperations {
    id: number;
    checked_in?: Date;
    checked_out?: Date;
    staff_id: number;
    check_in_coordinates_id?: number;
    check_out_coordinates_id?: number;
    schedule_id: number;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    is_deleted:boolean;

}
