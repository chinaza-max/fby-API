
export default interface IJob {
    id: number;
    staff_id: number;
    memo_id: number;
    reply_message:string;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;

}
