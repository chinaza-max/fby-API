"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.JobSecurityCode = exports.JobReports = exports.AgendaOperations = exports.Agendas = exports.DeletedUploads = exports.JobLogs = exports.LocationCheckOperations = exports.ScanOperations = exports.PasswordReset = exports.Statistics = exports.MynewAgenda = exports.Schedule = exports.AssignedStaffs = exports.JobOperations = exports.Job = exports.Location = exports.Coordinates = exports.FacilityLocation = exports.Facility = exports.Customer = exports.Staff = exports.Admin = void 0;
const admin_model_1 = __importStar(require("./admin.model"));
exports.Admin = admin_model_1.default;
const staff_model_1 = __importStar(require("./staff.model"));
exports.Staff = staff_model_1.default;
const customer_model_1 = __importStar(require("./customer.model"));
exports.Customer = customer_model_1.default;
const facility_model_1 = __importStar(require("./facility.model"));
exports.Facility = facility_model_1.default;
const facility_location_model_1 = __importStar(require("./facility_location.model"));
exports.FacilityLocation = facility_location_model_1.default;
const coordinates_model_1 = __importStar(require("./coordinates.model"));
exports.Coordinates = coordinates_model_1.default;
const location_model_1 = __importStar(require("./location.model"));
exports.Location = location_model_1.default;
const job_model_1 = __importStar(require("./job.model"));
exports.Job = job_model_1.default;
const job_operations_model_1 = __importStar(require("./job_operations.model"));
exports.JobOperations = job_operations_model_1.default;
const assigned_staffs_model_1 = __importStar(require("./assigned_staffs.model"));
exports.AssignedStaffs = assigned_staffs_model_1.default;
const schedule_model_1 = __importStar(require("./schedule.model"));
exports.Schedule = schedule_model_1.default;
const statistics_model_1 = __importStar(require("./statistics.model"));
exports.Statistics = statistics_model_1.default;
const password_reset_model_1 = __importStar(require("./password_reset.model"));
exports.PasswordReset = password_reset_model_1.default;
const scan_operations_model_1 = __importStar(require("./scan_operations.model"));
exports.ScanOperations = scan_operations_model_1.default;
const location_check_operations_model_1 = __importStar(require("./location_check_operations.model"));
exports.LocationCheckOperations = location_check_operations_model_1.default;
const job_logs_model_1 = __importStar(require("./job_logs.model"));
exports.JobLogs = job_logs_model_1.default;
const deleted_uploads_model_1 = __importStar(require("./deleted_uploads.model"));
exports.DeletedUploads = deleted_uploads_model_1.default;
const agendas_model_1 = __importStar(require("./agendas.model"));
exports.Agendas = agendas_model_1.default;
const agenda_operations_model_1 = __importStar(require("./agenda_operations.model"));
exports.AgendaOperations = agenda_operations_model_1.default;
const job_reports_model_1 = __importStar(require("./job_reports.model"));
exports.JobReports = job_reports_model_1.default;
const job_security_code_model_1 = __importStar(require("./job_security_code.model"));
exports.JobSecurityCode = job_security_code_model_1.default;
const mynewAgenda_model_1 = __importStar(require("./mynewAgenda.model"));
exports.MynewAgenda = mynewAgenda_model_1.default;
function associate() {
    // User Favorite Relationships
    admin_model_1.default.belongsTo(location_model_1.default, {
        onDelete: 'cascade',
        foreignKey: {
            allowNull: false,
            name: "location_id",
            field: "location_id",
        },
        as: "location",
    });
    assigned_staffs_model_1.default.belongsTo(job_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "job_id",
            field: "job_id",
        },
        as: "job",
    });
    assigned_staffs_model_1.default.belongsTo(admin_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "staff_id",
            field: "staff_id",
        },
        as: "staff",
    });
    customer_model_1.default.belongsTo(location_model_1.default, {
        onDelete: 'cascade',
        foreignKey: {
            allowNull: false,
            name: "location_id",
            field: "location_id",
        },
        as: "location",
    });
    facility_location_model_1.default.belongsTo(coordinates_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "coordinates_id",
            field: "coordinates_id",
        },
        as: "coordinates",
    });
    facility_model_1.default.belongsTo(facility_location_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "facility_location_id",
            field: "facility_location_id",
        },
        as: "facility_location",
    });
    facility_model_1.default.belongsTo(customer_model_1.default, {
        onDelete: 'cascade',
        foreignKey: {
            allowNull: false,
            name: "customer_id",
            field: "customer_id",
        },
        as: "customer",
    });
    customer_model_1.default.hasMany(facility_model_1.default, {
        as: "facilities",
    });
    job_operations_model_1.default.belongsTo(coordinates_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "check_in_coordinates_id",
            field: "check_in_coordinates_id",
        },
        as: "check_in_coordinates",
    });
    job_operations_model_1.default.belongsTo(coordinates_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "check_out_coordinates_id",
            field: "check_out_coordinates_id",
        },
        as: "check_out_coordinates",
    });
    job_operations_model_1.default.belongsTo(schedule_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "schedule_id",
            field: "schedule_id",
        },
        as: "schedule",
    });
    job_model_1.default.belongsTo(customer_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "customer_id",
            field: "customer_id",
        },
        as: "customer",
    });
    job_model_1.default.belongsTo(facility_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "facility_id",
            field: "facility_id",
        },
        as: "facility",
    });
    schedule_model_1.default.belongsTo(job_model_1.default, {
        onDelete: 'cascade',
        foreignKey: {
            allowNull: false,
            name: "job_id",
            field: "job_id",
        },
        as: "job",
    });
    job_model_1.default.hasMany(schedule_model_1.default);
    job_reports_model_1.default.belongsTo(job_model_1.default, {
        onDelete: 'cascade',
        foreignKey: {
            allowNull: false,
            name: "job_id",
            field: "job_id",
        },
        as: "job",
    });
    job_model_1.default.hasMany(job_reports_model_1.default);
    mynewAgenda_model_1.default.belongsTo(job_model_1.default, {
        onDelete: 'cascade',
        foreignKey: {
            allowNull: false,
            name: "job_id",
            field: "job_id",
        },
        as: "job",
    });
    job_model_1.default.hasMany(mynewAgenda_model_1.default);
    password_reset_model_1.default.belongsTo(admin_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "user_id",
            field: "user_id",
        },
        as: "user",
    });
    scan_operations_model_1.default.belongsTo(job_operations_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "job_operations_id",
            field: "job_operations_id",
        },
        as: "job_operations",
    });
    scan_operations_model_1.default.belongsTo(coordinates_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "coordinates_id",
            field: "coordinates_id",
        },
        as: "coordinates",
    });
    location_check_operations_model_1.default.belongsTo(job_operations_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "job_operations_id",
            field: "job_operations_id",
        },
        as: "job_operations",
    });
    location_check_operations_model_1.default.belongsTo(coordinates_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "coordinates_id",
            field: "coordinates_id",
        },
        as: "coordinates",
    });
    job_logs_model_1.default.belongsTo(job_model_1.default, {
        onDelete: 'cascade',
        foreignKey: {
            allowNull: false,
            name: "job_id",
            field: "job_id",
        },
        as: "job",
    });
    job_logs_model_1.default.belongsTo(coordinates_model_1.default, {
        onDelete: 'cascade',
        foreignKey: {
            allowNull: false,
            name: "coordinates_id",
            field: "coordinates_id",
        },
        as: "coordinates",
    });
    agendas_model_1.default.belongsTo(job_model_1.default, {
        onDelete: 'cascade',
        foreignKey: {
            allowNull: false,
            name: "job_id",
            field: "job_id",
        },
        as: "job",
    });
    //Job.hasMany(Agendas);
    agenda_operations_model_1.default.belongsTo(agendas_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "agenda_id",
            field: "agenda_id",
        },
        as: "agenda",
    });
    job_security_code_model_1.default.belongsTo(coordinates_model_1.default, {
        foreignKey: {
            allowNull: false,
            name: "coordinates_id",
            field: "coordinates_id",
        },
        as: "coordinates",
    });
}
function init(connection) {
    (0, admin_model_1.init)(connection);
    (0, staff_model_1.init)(connection);
    (0, customer_model_1.init)(connection);
    (0, facility_model_1.init)(connection);
    (0, facility_location_model_1.init)(connection);
    (0, coordinates_model_1.init)(connection);
    (0, location_model_1.init)(connection);
    (0, job_model_1.init)(connection);
    (0, statistics_model_1.init)(connection);
    (0, schedule_model_1.init)(connection);
    (0, mynewAgenda_model_1.init)(connection);
    (0, job_operations_model_1.init)(connection);
    (0, assigned_staffs_model_1.init)(connection);
    (0, password_reset_model_1.init)(connection);
    (0, scan_operations_model_1.init)(connection);
    (0, location_check_operations_model_1.init)(connection);
    (0, job_logs_model_1.init)(connection);
    (0, deleted_uploads_model_1.init)(connection);
    (0, agendas_model_1.init)(connection);
    (0, agenda_operations_model_1.init)(connection);
    (0, job_reports_model_1.init)(connection);
    (0, job_security_code_model_1.init)(connection);
    associate();
}
exports.init = init;
//# sourceMappingURL=index.js.map