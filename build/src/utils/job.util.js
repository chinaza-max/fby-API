"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class JobUtil {
    constructor() {
        this.verifyGetLogPerGuard = joi_1.default.object().keys({
            job_id: joi_1.default.number().required(),
            guard_id: joi_1.default.number().required(),
        });
        this.verifyShiftPerGuardAllJob = joi_1.default.object().keys({
            guard_id: joi_1.default.number().required(),
        });
        this.verifyGetShiftPerGuard = joi_1.default.object().keys({
            job_id: joi_1.default.number().required(),
            guard_id: joi_1.default.number().required(),
        });
        this.verifyGetgetGeneralShift = joi_1.default.object().keys({});
        this.verifygetOneShedulePerGuard = joi_1.default.object().keys({
            job_id: joi_1.default.number().required(),
            guard_id: joi_1.default.number().required(),
        });
        this.verifySubmitReportAndAttachment = joi_1.default.object().keys({
            job_id: joi_1.default.number().required(),
            guard_id: joi_1.default.number().required(),
            report_type: joi_1.default.string().required(),
            who_has_it: joi_1.default.string().required(),
            is_emergency: joi_1.default.boolean().required(),
            is_read: joi_1.default.boolean().required(),
            message: joi_1.default.string(),
            file: joi_1.default.alternatives(joi_1.default.string(), joi_1.default.object().unknown(true).error((errors) => {
                errors.forEach(error => {
                    error.message = "Image must be a valid file not greater than 1mb";
                });
                return errors;
            }))
        });
        this.verifyGetSingleReportGuard = joi_1.default.object().keys({
            job_id: joi_1.default.number().required(),
            guard_id: joi_1.default.number().required(),
        });
        //THIS MAY THROW ERROR BECAUSE CHANGES WAS MADE HERE WITH NO TEST
        this.verifygetGuardPerJob = joi_1.default.object().keys({
            job_id: joi_1.default.number().required(),
        });
        this.verifyGetAllUnsettleShiftOneGuard = joi_1.default.object().keys({
            guard_id: joi_1.default.number().required(),
            settlement: joi_1.default.boolean().required()
        });
        this.verifySettleShift = joi_1.default.object().keys({
            schedule_id: joi_1.default.array().required(),
        });
        this.verifyUpdateJobStatus = joi_1.default.object().keys({
            job_id: joi_1.default.number().required(),
            status_value: joi_1.default.string().required(),
        });
        this.verifyRemoveGuardSheduleLog = joi_1.default.object().keys({
            log_id: joi_1.default.number().required()
        });
        this.verifyRemoveGuardSingleShedule = joi_1.default.object().keys({
            guard_id: joi_1.default.number().required(),
            schedule_id: joi_1.default.number().required(),
        });
        this.verifyRemoveGuardShedule = joi_1.default.object().keys({
            guard_id: joi_1.default.number().required(),
            job_id: joi_1.default.number().required(),
        });
        this.verifyUpdateMaxCheckInTime = joi_1.default.object().keys({
            guard_id: joi_1.default.number(),
            shedule_id: joi_1.default.number(),
            max_check_in_time: joi_1.default.number(),
        });
        this.verifyDeleteJob = joi_1.default.object().keys({
            job_id: joi_1.default.number().required()
        });
        this.verifysheduleDateCreation = joi_1.default.object().keys({
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
            date_time_staff_shedule: joi_1.default.array().min(1).required().items({
                guard_id: joi_1.default.number().required(),
                job_id: joi_1.default.number().required(),
                start_time: joi_1.default.required(),
                end_time: joi_1.default.string(),
                status_per_staff: joi_1.default.string().required(),
                schedule_length: joi_1.default.string().required(),
                check_in_date: joi_1.default.date()
                    .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
                    .required(),
                check_out_date: joi_1.default.date()
                    .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
                    .required(),
            })
        });
        this.verifySheduleAgenda = joi_1.default.object().keys({
            shedule_agenda: joi_1.default.array().min(1).required().items({
                guard_id: joi_1.default.number().required(),
                job_id: joi_1.default.number().required(),
                time: joi_1.default.string(),
                description: joi_1.default.string().required(),
                title: joi_1.default.string(),
                status_per_staff: joi_1.default.string().required(),
                agenda_type: joi_1.default.string().required(),
                check_in_date: joi_1.default.date()
                    .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
                    .required(),
            })
        });
        this.verifyJobCreationData = joi_1.default.object().keys({
            description: joi_1.default.string().trim().min(1),
            customer_id: joi_1.default.number().required(),
            site_id: joi_1.default.number().required(),
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
            job_status: joi_1.default.string()
                .valid("ACTIVE", "PENDING", "COMPLETED"),
            staff_charge: joi_1.default.number().required(),
            client_charge: joi_1.default.number().required(),
            job_type: joi_1.default.string().required()
                .valid("INSTANT", "ONGOING", "TEMPORAL", "PERMANENT"),
            payment_status: joi_1.default.string().required()
        });
        this.verifyJobUpdateData = joi_1.default.object().keys({});
        this.verifyCheckinData = joi_1.default.object().keys({
            job_id: joi_1.default.number().min(1).required(),
            guard_id: joi_1.default.number().min(1).required(),
            check_in: joi_1.default.boolean().required(),
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required()
        });
        this.verifyCheckInCheckOutAdmin = joi_1.default.object().keys({
            shedule_id: joi_1.default.number().min(1).required(),
            guard_id: joi_1.default.number().min(1).required(),
            job_id: joi_1.default.number().min(1).required(),
            check_in: joi_1.default.boolean().required(),
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
            date: joi_1.default.date()
                .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
                .required(),
        });
        this.verifyAcceptDeclineData = joi_1.default.object().keys({
            job_id: joi_1.default.number().min(1),
            guard_id: joi_1.default.number().min(1),
            accept: joi_1.default.boolean().required(),
        });
    }
}
exports.default = new JobUtil();
/*


import Joi from "joi";

class JobUtil {
  public verifyJobCreationData = Joi.object().keys({
    description: Joi.string().trim().min(1),
    customer_id: Joi.number().required(),
    site_id: Joi.number().required(),
    status: Joi.string()
      .required()
      .valid("PENDING", "ONGOING", "COMPLETED", "CANCELED"),
    amount: Joi.number().required(),
    job_type: Joi.string()
      .required()
      .valid("INSTANT", "ONGOING", "TEMPORAL", "PERMANENT"),
    schedule: Joi.array()
      .min(1)
      .required()
      .items({
        check_in_date: Joi.date()
          .min(new Date().toLocaleDateString("af-AZ"))
          .required(),
        start_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
        end_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
      }),
    assigned_staffs: Joi.array().min(1).required().items({
      staff_id: Joi.required(),
    }),
    tasks: Joi.array().required().items({
      title: Joi.string().required(),
      description: Joi.string().required(),
    }),
    agendas: Joi.array().required().items({
      title: Joi.string().required(),
      description: Joi.string().required(),
      start_time: Joi.string().required(),
    }),
    use_security_code: Joi.boolean().required(),
  });

  public verifyJobUpdateData = Joi.object().keys({
  });

  public verifyCheckinData = Joi.object().keys({
    operation_id: Joi.number().min(1),
    check_in: Joi.boolean().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  });

  public verifyAcceptDeclineData = Joi.object().keys({
    job_id: Joi.number().min(1),
    accept: Joi.boolean().required(),
  });
}

export default new JobUtil();
*/ 
//# sourceMappingURL=job.util.js.map