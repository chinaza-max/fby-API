
export default interface ILicense {
    id: number;
    staff_id: number;
    license:string;
    time_zone:string;
    expires_in: Date;
    approved:boolean;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
}
