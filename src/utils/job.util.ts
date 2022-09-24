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
  });

  public verifyJobUpdateData = Joi.object().keys({
  });
}

export default new JobUtil();
