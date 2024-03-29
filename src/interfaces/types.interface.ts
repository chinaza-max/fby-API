export type GenderTypes = "MALE" | "FEMALE" | "NOT_SPECIFIED";

export type JobStatus = "ACTIVE" | "PENDING" | "COMPLETED" | "CANCELED";

export type JobTypes = "INSTANT" | "ONGOING" | "TEMPORAL" | "PERMANENT";

export type ScheduleLengthTypes = "LIMITED" | "CONTINUOUS";

export type RoleTypes = "ADMIN" | "GUARD" | "SUPER_ADMIN" | "ACCOUNT_MANGER";

export type StatTypes =
  | "CUSTOMER_SIGNIN"
  | "CUSTOMER_SIGNUP"
  | "GUARD_SIGNIN"
  | "GUARD_SIGNUP"
  | "STAFF_SIGNIN"
  | "STAFF_SIGNUP"
  | "JOB"
  | "JOB_REQUEST"
  | "TRANSACTION";

export type AgendaTypes = 'TASK' | 'INSTRUCTION';

export type JobReportPriorityTypes = "LOW" | "MEDIUM" | "HIGH" | "VERY HIGH";