export default interface IFacilityLocation {
    id: number;
    address: string;
    coordinates_id: number;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
}
