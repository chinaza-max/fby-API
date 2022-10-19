import Joi from "joi";

class AdminUtil {
  public verifyUserCreationData = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().trim().required(),
    password: Joi.string(),
    date_of_birth: Joi.date().min(new Date("1900-01-01").toLocaleDateString("af-AZ")).required(),
    gender: Joi.string().required().valid('MALE', 'FEMALE', 'NOT_SPECIFIED'),
    // image: Joi.string().min(5),
  });

  public validateUserEmail = Joi.object().keys({
    email: Joi.string().email().required(),
  });

  public validatePasswordReset = Joi.object().keys({
    password: Joi.string().min(6).required(),
    reset_password_key: Joi.string().min(1).required(),
  });
}

export default new AdminUtil();
