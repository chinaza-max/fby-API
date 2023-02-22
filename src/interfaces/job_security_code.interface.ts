export interface IJobSecurityCode {
  id: number;
  agenda_id: number;
  guard_id: number;
  job_id:number;
  security_code: string;
  created_at: Date;
  updated_at: Date;
  is_deleted:boolean;

}
