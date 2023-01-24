export interface ICustomer_suspension_comments {
    id: number;
    comment: string;
    admin_id: number;
    customer_id: number;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    last_logged_in?: Date;
}
