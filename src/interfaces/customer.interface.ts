import { GenderTypes } from "./types.interface";

export default interface ICustomer {
    id: number;
    image?: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    date_of_birth: Date;
    gender: GenderTypes;
    location_id?: number;
    created_at?: Date;
    updated_at?: Date;
    is_archived?: boolean;
    last_logged_in?: Date;
    phone_number:number;
}
