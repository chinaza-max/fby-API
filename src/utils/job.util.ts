import Joi from "joi";

class JobUtil {

  



  
  public verifyGetPerformSecurityCheckLog = Joi.object().keys({
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),

  });
  
  public verifyGetLogPerGuard = Joi.object().keys({
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),

  });
  


 

    
  public verifyShiftPerGuardAllJob = Joi.object().keys({
    guard_id: Joi.number().required(),

  });



  public verifyGetShiftPerGuard = Joi.object().keys({
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),

  });

  
  public verifyGetOneAgendaPerGuard = Joi.object().keys({
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),
    type: Joi.string().required(),
  });
  
  public verifyGetOneShedulePerGuard = Joi.object().keys({
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),
  });



  public verifySubmitReportAndAttachment = Joi.object().keys({
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),
    reference_date:Joi.date()
    .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
    .required(),
    report_type: Joi.string().required(),
    who_has_it: Joi.string().required(),
    is_emergency: Joi.boolean().required(),
    is_read:Joi.boolean().required(),
    message: Joi.string(),
    file: Joi.alternatives(
      Joi.string(),
      Joi.object().unknown(true).error((errors: any) => {
        errors.forEach(error => {
          error.message = "Image must be a valid file not greater than 1mb";
        });
        return errors;
      })
    )
  });


  
  public verifyGetSingleReportGuard = Joi.object().keys({
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),

  });


  
  public verifygetGetSecurityCodePerJob= Joi.object().keys({
    job_id: Joi.number().required(),
  });


  public verifygetGuardPerJob = Joi.object().keys({
    job_id: Joi.number().required(),
  });


  public verifyGetAllUnsettleShiftOneGuard = Joi.object().keys({
    guard_id: Joi.number(),
    settlement:Joi.boolean().required()
  });

  
  
  
  public verifyPerformSecurityCheck = Joi.object().keys({
    my_time_zone: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),
    comment: Joi.string().required()
});

  public verifyCheckPositionQRcode = Joi.object().keys({
    my_time_zone: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    job_id: Joi.number().required()
});
  
  public verifyDeleteAgenda = Joi.object().keys({
    my_time_zone: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    agenda_id: Joi.number().required()
});
  

  public verifyCheckTaskGuard = Joi.object().keys({
    my_time_zone: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    agenda_id: Joi.number().required()
});

  public verifyVerifySecurityCode = Joi.object().keys({
    my_time_zone: Joi.string().required(),
    job_id: Joi.number().required(),
    guard_id: Joi.number().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    security_code: Joi.string().required()

});

  public verifyGetGuardIdFromJob = Joi.object().keys({
    jobs_id: Joi.array().required(),
});

  public verifySettleShift = Joi.object().keys({
    schedule_id: Joi.array().required(),
});
  
  public verifyUpdateJobStatus = Joi.object().keys({
    job_id: Joi.number().required(),
    status_value: Joi.string().required(),
});


  public verifyRemoveGuardSheduleLog = Joi.object().keys({
    log_id: Joi.number().required()
  });

  
  public verifyRemoveGuardSingleShedule= Joi.object().keys({
    guard_id: Joi.number().required(),
    schedule_id: Joi.number().required(),
});



  public verifyRemoveGuardShedule = Joi.object().keys({
      guard_id: Joi.number().required(),
      job_id: Joi.number().required(),
  });

  
  public verifyUpdateScheduleAcceptStatus = Joi.object().keys({
    my_time_zone: Joi.string().required(),
    status: Joi.boolean().required(),
    schedule_id:Joi.number()
  });

  public verifyUpdateMaxCheckInTime = Joi.object().keys({
    guard_id: Joi.number(),
    shedule_id:Joi.number(),
    max_check_in_time:Joi.number(),
  });

  

  public verifyReplyMemo = Joi.object().keys({
    memo_receiver_id:Joi.number().required(),
    my_time_zone: Joi.string().required(),
    message:Joi.string().required()
    
  });



  public verifyDeleteMemo = Joi.object().keys({
    memo_id:Joi.number().required()
  });


  public verifyDeleteJob = Joi.object().keys({
    job_id:Joi.number().required()
  });


  public verifyRescheduleAndRemoveGuard = Joi.object().keys({
    job_id:Joi.number().required(),
    my_time_zone: Joi.string().required(),
    old_guard_id:Joi.number().required(),
    array_guard_id: Joi.array().required()
  });

  public verifysheduleDateCreation = Joi.object().keys({
    my_time_zone: Joi.string().required(),
    created_by_id: Joi.number().required(),
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

  public verifyScheduleDateJob = Joi.object().keys({
    description: Joi.string().trim().min(1),
    customer_id: Joi.number().required(),
    site_id: Joi.number().required(),
    created_by_id:Joi.number().required(),
    my_time_zone: Joi.string().required(),
    staff_charge: Joi.number().required(),
    client_charge: Joi.number().required(),
    check_in_date:Joi.date()
      .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
      .required(),
    check_out_date:Joi.date()
      .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
      .required(),
  });
  



  


  public verifyCreateMemo = Joi.object().keys({
    my_time_zone: Joi.string().required(),
    message: Joi.string().required(),
    send_date:Joi.date()
    .min(new Date("1900-01-01").toLocaleDateString("af-AZ")).allow("").allow(null),
    created_by_id: Joi.number().required(),
    guards_details: Joi.array().required()
  })


  public verifySheduleAgenda = Joi.object().keys({
      my_time_zone: Joi.string().required(),
      created_by_id: Joi.number().required(),
      shedule_agenda: Joi.array().min(1).required().items({
      guard_id: Joi.number().required(),
      job_id: Joi.number().required(),
      description: Joi.string().required(),
      title: Joi.string(),
      status_per_staff: Joi.string().required(),
      agenda_type: Joi.string().required(),
      operation_date:Joi.date()
      .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
      .required(),
      
    })
  });



  public verifyJobCreationData = Joi.object().keys({
    description: Joi.string().trim().min(1),
    customer_id: Joi.number().required(),
    site_id: Joi.number().required(),
    created_by_id:Joi.number().required(),
    my_time_zone: Joi.string().required(),
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
    my_time_zone: Joi.string().required(),
    schedule_id: Joi.number().min(1).required(),
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
  public verifyAllJobsdoneByGaurd = Joi.object().keys({
    guard_id: Joi.number().min(1),
  })
  public getAllSiteWorkByGaurdForCompany = Joi.object().keys({
    job_id: Joi.number().min(1),
  })
  public getJobDetails = Joi.object().keys({
    job_id: Joi.number().min(1),
  })

  public verifyCreateShiftComment = Joi.object().keys({
    my_time_zone: Joi.string().required(),
    comment: Joi.string().required(),
    created_by_id: Joi.number().required(),
    reference_date:Joi.date()
      .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
      .required(),
    schedule_id: Joi.number().required()
  })

  public verifyDeleteShiftComment = Joi.object().keys({
    comment_id:Joi.number().required()
  });

  public verifyGetShiftComment = Joi.object().keys({
    comment_id:Joi.number().required()
  });

  public verifyGetJobsAttachedToSite = Joi.object().keys({
    site_id:Joi.number().required()
  });
}

export default new JobUtil();

