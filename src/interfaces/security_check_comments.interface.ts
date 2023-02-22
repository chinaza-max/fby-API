
export default interface ISecurityCheckComments {
    id: number;
    guard_id: number;
    security_check_log_id: number;
    comment:string;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    is_deleted:boolean;
}
