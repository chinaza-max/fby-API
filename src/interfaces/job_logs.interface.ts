export interface IJobLogs {
  id: number;
  message: string;
  job_id: number;
  guard_id: number;
  check_in_time: string;
  check_out_time: string;
  check_out_status:boolean;
  coordinates_id: number;
  created_at: Date;
  updated_at: Date;
  check_in_status:boolean;
  hours_worked:number;
  date:Date
}
