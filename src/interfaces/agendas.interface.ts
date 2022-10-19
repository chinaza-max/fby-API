import { AgendaTypes } from "./types.interface";

export interface IAgendas {
  id: number;
  title: string;
  description: string;
  schedule_id: number;
  agenda_type: AgendaTypes;
  created_at: Date;
  updated_at: Date;
  start_time?: Date;
  end_time?: Date;
}
