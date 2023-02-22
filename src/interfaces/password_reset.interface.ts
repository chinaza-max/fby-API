export interface IPasswordReset {
    id: number;
    user_id: number;
    reset_key: string;
    expires_in: Date;
    created_at: Date;
    is_deleted:boolean;

  }