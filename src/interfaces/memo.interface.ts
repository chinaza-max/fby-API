
export default interface IJob {
    id: number;
    created_by_id: number;
    memo_message:string;
    time_zone:string;
    send_date: Date;
    is_delivered: boolean;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    is_deleted:boolean;


}
