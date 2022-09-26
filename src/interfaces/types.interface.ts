export type GenderTypes = "MALE" | "FEMALE" | "NOT_SPECIFIED";

export type JobStatus = "PENDING" | "ONGOING" | "COMPLETED" | "CANCELED";

export type JobTypes = "INSTANT" | "ONGOING" | "TEMPORAL" | "PERMANENT";

export type ScheduleLengthTypes = "LIMITED" | "CONTINUOUS";

export type RoleTypes = "ADMIN" | "GUARD";

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
