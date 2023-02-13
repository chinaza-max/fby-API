
export interface ISubscription {
    id: number;
    guard_id:number;
    subscription: JSON;
    location_id?: number;
    created_at?: Date;
    updated_at?: Date;

}
