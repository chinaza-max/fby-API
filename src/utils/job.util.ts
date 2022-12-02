import Joi from "joi";

class JobUtil {

  


  
  public verifyGetLogPerGuard = Joi.object().keys({
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),

  });
  
  public verifyGetShiftPerGuard = Joi.object().keys({
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),

  });

  
  public verifyGetgetGeneralShift = Joi.object().keys({
    
  });

  public verifygetOneShedulePerGuard = Joi.object().keys({
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),

  });

  public verifygetGuardPerJob = Joi.object().keys({
    job_id: Joi.number().required(),
  });


  
  public verifySettleSingleShift = Joi.object().keys({
   
    schedule_id: Joi.number().required(),

});
  
  public verifyUpdateJobStatus = Joi.object().keys({
    job_id: Joi.number().required(),
    status_value: Joi.string().required(),
});


  public verifyRemoveGuardSheduleLog = Joi.object().keys({
    log_id: Joi.number().required()
  });

  public verifyRemoveGuardShedule = Joi.object().keys({
      guard_id: Joi.number().required(),
      job_id: Joi.number().required(),
  });



  

  public verifyUpdateMaxCheckInTime = Joi.object().keys({
    guard_id: Joi.number(),
    shedule_id:Joi.number(),
    max_check_in_time:Joi.number(),
  });


  public verifyDeleteJob = Joi.object().keys({
    job_id:Joi.number().required()
  });
  
  public verifysheduleDateCreation = Joi.object().keys({
    date_time_staff_shedule: Joi.array().min(1).required().items({
      guard_id: Joi.number().required(),
      job_id: Joi.number().required(),
      start_time: Joi.required(),
      end_time: Joi.string(),
      status_per_staff: Joi.string().required(),
      schedule_length: Joi.string().required(),
      check_in_date:Joi.date()
      .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
      .required(),
      check_out_date:Joi.date()
      .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
      .required(),

    })
  });

  public verifySheduleAgenda = Joi.object().keys({
    shedule_agenda: Joi.array().min(1).required().items({
      guard_id: Joi.number().required(),
      job_id: Joi.number().required(),
      time: Joi.string(),
      description: Joi.string().required(),
      title: Joi.string(),
      status_per_staff: Joi.string().required(),
      agenda_type: Joi.string().required(),
      check_in_date:Joi.date()
      .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
      .required(),
      
    })
  });

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
    job_id: Joi.number().min(1).required(),
    guard_id: Joi.number().min(1).required(),
    check_in: Joi.boolean().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  });


  public verifyCheckInCheckOutAdmin = Joi.object().keys({
    shedule_id: Joi.number().min(1).required(),
    guard_id: Joi.number().min(1).required(),
    job_id: Joi.number().min(1).required(),
    check_in: Joi.boolean().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    date:Joi.date()
      .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
      .required(),
  });

  public verifyAcceptDeclineData = Joi.object().keys({
    job_id: Joi.number().min(1),
    guard_id: Joi.number().min(1),
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