import { JobReportPriorityTypes } from "./types.interface";

export interface IJobReports {
  id: number;
  job_operations_id: number;
  message?: string;
  is_emergency: boolean;
  priority: JobReportPriorityTypes;
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
}