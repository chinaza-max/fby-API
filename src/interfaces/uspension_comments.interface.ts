export interface ISuspension_comments {
    id: number;
    comment: string;
    admin_id: number;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    last_logged_in?: Date;
}
