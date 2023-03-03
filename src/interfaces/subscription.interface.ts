
export interface ISubscription {
    id: number;
    staff_id:number;
    subscription: string;
    location_id?: number;
    created_at?: Date;
    updated_at?: Date;
    is_deleted:boolean;
}
