import { AgendaTypes } from "./types.interface";

export interface ImynewAgenda {
  id: number;
  title: string;
  description: string;
  status_per_staff: string;
  job_id: number;
  guard_id: number;
  agenda_type: AgendaTypes;
  created_at: Date;
  updated_at: Date;
  check_in_date?: Date;
  time?: Date;

  
}
