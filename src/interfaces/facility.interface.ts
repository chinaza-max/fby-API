export default interface IFacility {
    id: number;
    facility_location_id: number;
    name: string;
    time_zone:string;
    customer_id: number;
    created_by_id: number;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    is_deleted:boolean;

}
