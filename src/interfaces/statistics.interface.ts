import { StatTypes } from "./types.interface";

export interface IStatistics {
  id: number;
  month: number;
  year: number;
  value: number;
  stat_type: StatTypes;
  created_at?: Date;
  updated_at?: Date;
  is_archived?: boolean;
}
