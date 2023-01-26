import Joi from "joi";

class UserUtil {






  
  public verifyLicenseRUD = Joi.object().keys({
    id: Joi.number().required(),
    my_time_zone: Joi.string().required(),
    type:Joi.string().required()
  });


  public verifyUploadLicense = Joi.object().keys({
    my_time_zone: Joi.string().required(),
    expires_in: Joi.date()
      .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
      .required(),
    file: Joi.object().unknown(true).error((errors: any) => {
        errors.forEach(error => {
          error.message = "file must be a valid file not greater than 5mb";
        });
        return errors;
      }),
  });

  
  
  public verifyUpdateProfileOtherAdmin = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    id: Joi.number().required(),
    address: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.string().required(),
    phone_number:Joi.number().required(),
    date_of_birth: Joi.date()
      .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
      .required(),
    gender: Joi.string().required().valid("MALE", "FEMALE", "NOT_SPECIFIED"),
    image: Joi.object().unknown(true).error((errors: any) => {
      errors.forEach(error => {
        error.message = "Image must be a valid file not greater than 1mb";
      });
      return errors;
    }),
  });

  public verifyUserUpdateData = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().required(),
    phone_number:Joi.number().required(),
    date_of_birth: Joi.date()
      .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
      .required(),
    gender: Joi.string().required().valid("MALE", "FEMALE", "NOT_SPECIFIED"),
    image: Joi.object().unknown(true).error((errors: any) => {
      errors.forEach(error => {
        error.message = "Image must be a valid file not greater than 1mb";
      });
      return errors;
    }),
  });
  public verifySuspension = Joi.object().keys({
    user_id : Joi.number().required(),
    comment: Joi.string().required()
  });
  public verifyUnSuspension = Joi.object().keys({
    user_id : Joi.number().required(),
  })
  public verifyCustomerSuspension = Joi.object().keys({
    customer_id : Joi.number().required(),
    comment: Joi.string().required()
  });
  public verifyCustomerUnSuspension = Joi.object().keys({
    customer_id : Joi.number().required(),
  })
}

export default new UserUtil();
