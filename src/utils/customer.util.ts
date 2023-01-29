import Joi from "joi";

class CustomerUtil {
  

  

  
  public verifyDeleteFacility = Joi.object().keys({
    site_id: Joi.number().required(),
  });

  public verifyUpdateFacility = Joi.object().keys({
    guard_charge: Joi.number().required(),
    facility_address: Joi.string().required(),
    client_charge: Joi.number().required(),
    site_id: Joi.number().required(),
    operations_area_constraint: Joi.number().required(),
    my_time_zone: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()

  });


  public verifyFacilityCreation = Joi.object().keys({
        site_name: Joi.string().required(),
        email: Joi.string().required(),
        guard_charge: Joi.number().required(),
        client_charge: Joi.number().required(),
        address: Joi.string().required(),
        google_address:Joi.string().required(),
        my_time_zone: Joi.string().required(),
        customer_id: Joi.number().required(),
        created_by_id: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        operations_area_constraint: Joi.number().required(),
  });


  


  public  verifyDeleteCustomer = Joi.object().keys({  
    address_id:Joi.number().required(),

  });

  public verifyUserCreationData = Joi.object().keys({
    company_name: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().trim().required(),
    phone_number:Joi.number().required(),
    created_by_id:Joi.number().required(),
    my_time_zone: Joi.string().required(),
    // password: Joi.string().required(),
    gender: Joi.string().required().valid('MALE', 'FEMALE', 'NOT_SPECIFIED'),
    // image: Joi.string().min(5),
   
  });

  
  public verifyUpdateProfile = Joi.object().keys({
    company_name: Joi.string().required(),
    email: Joi.string().required(),
    phone_number: Joi.number().required(),
    id: Joi.number().required(),
    gender: Joi.string().required(),
    address: Joi.string().required()
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
  public verifyCustomerSuspension = Joi.object().keys({
    customer_id : Joi.number().required(),
    comment: Joi.string().required()
  });
  public verifyCustomerUnSuspension = Joi.object().keys({
    customer_id : Joi.number().required(),
  })
}

export default new CustomerUtil();
