export default interface ILocation {
    id: number;
    address: string;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    is_deleted:boolean;

}
