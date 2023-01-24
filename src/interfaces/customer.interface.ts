import { GenderTypes } from "./types.interface";

export default interface ICustomer {
    id: number;
    image?: string;
    company_name: string;
    email: string;
    password: string;
    date_of_birth: Date;
    gender: GenderTypes;
    location_id?: number;
    suspended: boolean;
    created_by_id:number;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    last_logged_in?: Date;
    phone_number:number;
}
