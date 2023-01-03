import { AgendaTypes } from "./types.interface";

export interface IAgendas {
  id: number;
  title: string;
  description: string;
  status_per_staff: string;
  job_id: number;
  guard_id: number;
  coordinates_id:number;
  agenda_type: AgendaTypes;
  created_at: Date;
  updated_at: Date;
  operation_date?: Date;
  agenda_done:boolean;
  date_schedule_id:number;
}
