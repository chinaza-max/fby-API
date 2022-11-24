import Joi from "joi";

class CustomerUtil {
  

  

  
  public verifyDeleteFacility = Joi.object().keys({
    site_id: Joi.number().required(),
  });

  public verifyUpdateFacility = Joi.object().keys({
    guard_charge: Joi.number().required(),
    site_name: Joi.string().required(),
    client_charge: Joi.number().required(),
    site_id: Joi.number().required(),
    operations_area_constraint: Joi.number().required(),
    facility_location_id: Joi.number().required(),
  });


  public verifyFacilityCreation = Joi.object().keys({
        site_name: Joi.string().required(),
        email: Joi.string().required(),
        guard_charge: Joi.number().required(),
        client_charge: Joi.number().required(),
        address: Joi.string().required(),
        latitude: Joi.number().required(),
        customer_id: Joi.number().required(),
        longitude: Joi.number().required(),
        operations_area_constraint: Joi.number().required(),
  });

  public verifyUserCreationData = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().trim().required(),
    // password: Joi.string().required(),
    date_of_birth: Joi.date().min(new Date("1900-01-01").toLocaleDateString("af-AZ")).required(),
    gender: Joi.string().required().valid('MALE', 'FEMALE', 'NOT_SPECIFIED'),
    // image: Joi.string().min(5),
    sites: Joi.array().min(1).max(10).items({
        site_name: Joi.string().required(),
        amount: Joi.number().required(),
        address: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        operations_area_constraint_active: Joi.boolean().required(),
        operations_area_constraint: Joi.number().required(),
    }),
  });
  
  public verifyUserUpdateData = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().trim().required(),
    // password: Joi.string().required(),
    date_of_birth: Joi.date().min(new Date("1900-01-01").toLocaleDateString("af-AZ")).required(),
    gender: Joi.string().required().valid('MALE', 'FEMALE', 'NOT_SPECIFIED'),
    // image: Joi.string().min(5),
    sites: Joi.array().min(1).max(20).items({
        site_name: Joi.string().required(),
        amount: Joi.number().required(),
        address: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        operations_area_constraint_active: Joi.boolean().required(),
        operations_area_constraint: Joi.number().required(),
    }),
  });
}

export default new CustomerUtil();
