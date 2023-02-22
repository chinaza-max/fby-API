import { GenderTypes } from "./types.interface";

export default interface IAdmin {
    id: number;
    image?: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    date_of_birth: Date;
    gender: GenderTypes;
    location_id?: number;
    created_by_id:number;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    last_logged_in?: Date;
    phone_number:number;
    availability:boolean;
    notification:boolean;
    suspended:boolean;
    can_suspend:boolean;
    is_deleted:boolean;  
    is_license_valid:boolean;  
}
  