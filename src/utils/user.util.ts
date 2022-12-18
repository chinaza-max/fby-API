import Joi from "joi";

class UserUtil {
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
}

export default new UserUtil();
