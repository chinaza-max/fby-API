export default interface IFacilityLocation {
    id: number;
    address: string;
    google_address: string;
    operations_area_constraint: number;
    operations_area_constraint_active: boolean;
    coordinates_id: number;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    is_deleted:boolean;

}
