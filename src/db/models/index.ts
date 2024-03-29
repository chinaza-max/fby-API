import { Sequelize } from "sequelize";
import Admin, { init as initAdmin } from "./admin.model";
import Staff, { init as initStaff } from "./staff.model";
import Customer, { init as initCustomer } from "./customer.model";
import Facility, { init as initFacility } from "./facility.model";
import FacilityLocation, {
  init as initFacilityLocation,
} from "./facility_location.model";
import Coordinates, { init as initCoordinates } from "./coordinates.model";
import Location, { init as initLocation } from "./location.model";
import Job, { init as initJob } from "./job.model";
import JobOperations, {
  init as initJobOperations,
} from "./job_operations.model";
import AssignedStaffs, {
  init as initAssignedStaffs,
} from "./assigned_staffs.model";
import Schedule, { init as initSchedule } from "./schedule.model";
import Subscriptions, { init as initSubscriptions } from "./subscription.model";

import Statistics, { init as initStatistics } from "./statistics.model";
import PasswordReset, {
  init as initPasswordReset,
} from "./password_reset.model";
import ScanOperations, {
  init as initScanOperations,
} from "./scan_operations.model";
import LocationCheckOperations, {
  init as initLocationCheckOperations,
} from "./location_check_operations.model";
import JobLogs, { init as initLogs } from "./job_logs.model";
import DeletedUploads, {
  init as initDeletedUploads,
} from "./deleted_uploads.model";
import Agendas, { init as initAgendas } from "./agendas.model";

import JobReports, { init as initJobReports } from "./job_reports.model";
import JobSecurityCode, {
  init as initJobSecurityCode,
} from "./job_security_code.model";

import SecurityCheckLog, {
  init as initSecurityCheckLog,
} from "./security_check_log.model";

import License, {
  init as initLicense,
} from "./license.model";

import Memo, {
  init as initMemo,
} from "./memo.model";

import MemoReceiver, {
  init as initMemoReceiver,
} from "./memo_receiver.model";

import Suspension_comments, {
  init as initSuspension_comments
} from "./suspension_comments.model"

import Customer_suspension_comments, { init as initCustomer_suspension_comments}
from "./customer_suspension_comments.model "

import Shift_comments , {
  init as initShift_comments
} from "./shift_comments.model"


import SecurityCheckComments, {
  init as initSecurityCheckComments
} from "./security_check_comments.model"

import Connection from "mysql2/typings/mysql/lib/Connection";


function associate() {
  // User Favorite Relationships
  Admin.belongsTo(Location, {
    onDelete: 'cascade',
    foreignKey: {
      allowNull: false,
      name: "location_id",
      field: "location_id",
    },
    as: "location",
  });
  AssignedStaffs.belongsTo(Job, {
    foreignKey: {
      allowNull: false,
      name: "job_id",
      field: "job_id",
    },
    as: "job",
  });
  AssignedStaffs.belongsTo(Admin, {
    foreignKey: {
      allowNull: false,
      name: "staff_id",
      field: "staff_id",
    },
    as: "staff",
  });
  Customer.belongsTo(Location, {
    onDelete: 'cascade',
    foreignKey: {
      allowNull: false,
      name: "location_id",
      field: "location_id",
    },
    as: "location",
  });
  FacilityLocation.belongsTo(Coordinates, {
    onDelete: 'cascade',
    foreignKey: {
      allowNull: false,
      name: "coordinates_id",
      field: "coordinates_id",
    },
    as: "coordinates",
  });
  Facility.belongsTo(FacilityLocation, {
    foreignKey: {
      allowNull: false,
      name: "facility_location_id",
      field: "facility_location_id",
    },
    as: "facility_location",
  });
  Facility.belongsTo(Customer, {
    onDelete: 'cascade',
    foreignKey: {
      allowNull: false,
      name: "customer_id",
      field: "customer_id",
    },
    as: "customer",
  });
  Customer.hasMany(Facility, {
    as: "facilities",
  });
  JobOperations.belongsTo(Coordinates, {
    foreignKey: {
      allowNull: false,
      name: "check_in_coordinates_id",
      field: "check_in_coordinates_id",
    },
    as: "check_in_coordinates",
  });
  JobOperations.belongsTo(Coordinates, {
    foreignKey: {
      allowNull: false,
      name: "check_out_coordinates_id",
      field: "check_out_coordinates_id",
    },
    as: "check_out_coordinates",
  });
  JobOperations.belongsTo(Schedule, {
    foreignKey: {
      allowNull: false,
      name: "schedule_id",
      field: "schedule_id",
    },
    as: "schedule",
  });
  Job.belongsTo(Customer, {
    foreignKey: {
      allowNull: false,
      name: "customer_id",
      field: "customer_id",
    },
    as: "customer",
  });
  Job.belongsTo(Facility, {
    foreignKey: {
      allowNull: false,
      name: "facility_id",
      field: "facility_id",
    },
    as: "facility",
  });
  Schedule.belongsTo(Job, {
    onDelete: 'cascade',
    foreignKey: {
      allowNull: false,
      name: "job_id",
      field: "job_id",
    },
    as:"job",
  });
  Job.hasMany(Schedule);

  Subscriptions.belongsTo(Admin, {
    onDelete: 'cascade',
    foreignKey: {
      allowNull: false,
      name: "staff_id",
      field: "staff_id",
    },
    as:"Admin",
  });


  JobReports.belongsTo(Job, {
    onDelete: 'cascade',
    foreignKey: {
      allowNull: false,
      name: "job_id",
      field: "job_id",
    },
    as:"job",
  });
  Job.hasMany(JobReports);



  PasswordReset.belongsTo(Admin, {
    foreignKey: {
      allowNull: false,
      name: "user_id",
      field: "user_id",
    },
    as: "user",
  });
  ScanOperations.belongsTo(JobOperations, {
    foreignKey: {
      allowNull: false,
      name: "job_operations_id",
      field: "job_operations_id",
    },
    as: "job_operations",
  });

  ScanOperations.belongsTo(Coordinates, {
    foreignKey: {
      allowNull: false,
      name: "coordinates_id",
      field: "coordinates_id",
    },
    as: "coordinates",
  });
  LocationCheckOperations.belongsTo(JobOperations, {
    foreignKey: {
      allowNull: false,
      name: "job_operations_id",
      field: "job_operations_id",
    },
    as: "job_operations",
  });
  LocationCheckOperations.belongsTo(Coordinates, {
    foreignKey: {
      allowNull: false,
      name: "coordinates_id",
      field: "coordinates_id",
    },
    as: "coordinates",
  });
  
  Job.hasMany(JobLogs);
  
  JobLogs.belongsTo(Job, {
    onDelete: 'cascade',
    foreignKey: {
      allowNull: false,
      name: "job_id",
      field: "job_id",
    },
    as: "job",
  });
  JobLogs.belongsTo(Coordinates, {
    onDelete: 'cascade',
    foreignKey: {
      allowNull: false,
      name: "coordinates_id",
      field: "coordinates_id",
    },
    as: "coordinates",
  });

  Agendas.belongsTo(Job, {
    onDelete: 'cascade',
    foreignKey: {
      allowNull: false,
      name: "job_id",
      field: "job_id",
    },
    as: "job",
  });
  
  //Job.hasMany(Agendas);
  JobSecurityCode.belongsTo(Agendas, {
    onDelete: 'cascade',
    foreignKey: {
      allowNull: false,
      name: "agenda_id",
      field: "agenda_id",
    },
    as: "agenda",
  });
  Admin.hasMany(Suspension_comments,{
    foreignKey: "user_id"})
  Suspension_comments.belongsTo(Admin, {
    foreignKey: {
      allowNull: false,
      name: "user_id",
      field: "user_id",
    },
    as: "suspension_comments",
  });

  Suspension_comments.belongsTo(Admin, {
    foreignKey: {
      allowNull: false,
      name: "admin_id",
      field: "admin_id",
    },
    as: "Admin_details",
  });

  Customer_suspension_comments.belongsTo(Admin, {
    foreignKey: {
      allowNull: false,
      name: "admin_id",
      field: "admin_id",
    },
    as: "Admin_details",
  });

  Customer.hasMany(Customer_suspension_comments);

  Customer_suspension_comments.belongsTo(Customer, {
    foreignKey: {
      allowNull: false,
      name: "customer_id",
      field: "customer_id",
    },
    as: "customer_suspension_comments",
  });

  Shift_comments.belongsTo(Schedule,
    {
      foreignKey: {
        // allowNull: false,
        name: "schedule_id",
        field: "schedule_id",
      },
      as: "Shift_comments",
  })

  Shift_comments.belongsTo(Admin,
    {
      foreignKey: {
        // allowNull: false,
        name: "created_by_id",
        field: "created_by_id",
      },
      as:"Admin_details"
    }
  )
      
  Schedule.hasMany(Shift_comments) 

  SecurityCheckLog.hasOne(SecurityCheckComments)

  SecurityCheckComments.belongsTo(SecurityCheckLog,
    {
      foreignKey: {
        // allowNull: false,
        name: "security_check_log_id",
        field: "security_check_log_id",
      },
      as:"Security_check"
    }
  )
   
  SecurityCheckComments.belongsTo(Admin,
    {
      foreignKey: {
        // allowNull: false,
        name: "guard_id",
        field: "guard_id",
      },
      as:"Admin_details"
    }
  )
}

export {
  Admin,
  Staff,
  Customer,
  Facility,
  FacilityLocation,
  Coordinates,
  Location,
  Job,
  JobOperations,
  AssignedStaffs,
  Schedule,
  Subscriptions,
  Statistics,
  PasswordReset,
  ScanOperations,
  LocationCheckOperations,
  JobLogs,
  DeletedUploads,
  Agendas,
  JobReports,
  JobSecurityCode,
  SecurityCheckLog,
  License,
  Memo,
  MemoReceiver,
  Suspension_comments,
  Customer_suspension_comments,
  Shift_comments,
  SecurityCheckComments
}

export function init(connection: Sequelize) {
  initAdmin(connection);
  initStaff(connection);
  initCustomer(connection);
  initFacility(connection);
  initFacilityLocation(connection);
  initCoordinates(connection);
  initLocation(connection);
  initJob(connection);
  initStatistics(connection);
  initSchedule(connection);
  initSubscriptions(connection)
  initJobOperations(connection);
  initAssignedStaffs(connection);
  initPasswordReset(connection);
  initScanOperations(connection);
  initLocationCheckOperations(connection);
  initLogs(connection);
  initDeletedUploads(connection);
  initAgendas(connection);
  initJobReports(connection);
  initJobSecurityCode(connection);
  initSecurityCheckLog(connection);
  initLicense(connection);
  initMemo(connection);
  initMemoReceiver(connection);
  initSuspension_comments(connection)
  initCustomer_suspension_comments(connection)
  initShift_comments(connection)
  initSecurityCheckComments(connection)
  associate();
}
