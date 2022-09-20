import Joi from "joi";

class AdminUtil {
  public verifyUserCreationData = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    date_of_birth: Joi.date().min(new Date("1900-01-01").toLocaleDateString("af-AZ")).required(),
    gender: Joi.string().required().valid('MALE', 'FEMALE', 'NOT_SPECIFIED'),
    image: Joi.string().min(5),
  });
}

export default new AdminUtil();
