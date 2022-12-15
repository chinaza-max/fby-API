import { JobReportPriorityTypes } from "./types.interface";

export interface IJobReports {
  id: number;
  job_id: number;
  guard_id:number;
  message: string;
  is_emergency: boolean;
  file_url: string;
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
  who_has_it:string;
  report_type:string;
}