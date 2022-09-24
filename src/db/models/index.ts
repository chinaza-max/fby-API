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
import Schedule, {
  init as initSchedule,
} from "./schedule.model";

function associate() {
  // User Favorite Relationships
  Admin.belongsTo(Location, {
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
  AssignedStaffs.belongsTo(Staff, {
    foreignKey: {
      allowNull: false,
      name: "staff_id",
      field: "staff_id",
    },
    as: "staff",
  });
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
  Schedule
};

export function init(connection: Sequelize) {
  initAdmin(connection);
  initStaff(connection);
  initCustomer(connection);
  initFacility(connection);
  initFacilityLocation(connection);
  initCoordinates(connection);
  initLocation(connection);
  initJob(connection);
  initSchedule(connection);
  initJobOperations(connection);
  initAssignedStaffs(connection);

  // associate();
}
