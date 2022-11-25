import Joi from "joi";

class JobUtil {



  public verifyJobCreationData = Joi.object().keys({
    description: Joi.string().trim().min(1),
    customer_id: Joi.number().required(),
    site_id: Joi.number().required(),
    job_status: Joi.string()
      .valid("ACTIVE", "PENDING", "COMPLETED"),
    staff_charge: Joi.number().required(),
    client_charge: Joi.number().required(),
    job_type: Joi.string().required()
      .valid("INSTANT", "ONGOING", "TEMPORAL", "PERMANENT"),
      payment_status: Joi.string().required()
    
   
    
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