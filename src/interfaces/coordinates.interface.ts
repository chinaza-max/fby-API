export default interface ICoordinates {
    id: number;
    longitude: number;
    latitude: number;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
}
