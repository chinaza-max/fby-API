import {
  Admin,
  Coordinates,
  Customer,
  Facility,
  FacilityLocation,
  Location,
} from "../db/models";
import axios from "axios";
import serverConfig from "../config/server.config";
import customerUtil from "../utils/customer.util";
import IAdmin from "../interfaces/admin.interface";
import bcrypt from "bcrypt";
import { ConflictError, SystemError, NotFoundError } from "../errors";
import authService from "./auth.service";
import ICustomer from "../interfaces/customer.interface";
import utilService from "./util.service";
import { fn, col, Op, QueryError, where } from "sequelize";
import { date, string } from "joi";
import momentTimeZone from "moment-timezone";
import moment from "moment"

interface DecodedToken {
  payload: ICustomer | null;
  expired: boolean | string | Error;
}

class CustomerService {
  private UserModel = Customer;
  private LocationModel = Location;
  private CoordinatesModel = Coordinates;
  private FacilityModel = Facility;
  private FacilityLocationModel = FacilityLocation;




  async handleCreateFacility(data: object): Promise<any> {
    const {
      longitude,
      latitude,
      my_time_zone,
      operations_area_constraint,
      client_charge,
      guard_charge,
      address,
      google_address,
      site_name,
      email,
      customer_id,
      created_by_id
    } = await customerUtil.verifyFacilityCreation.validateAsync(data);
  
    var existingUser = await this.getUserByEmail(email);
    if (existingUser != null){

      var existingSite = await this.getsitebyName(site_name,customer_id);

      if (existingSite != null){
        throw new ConflictError("Site name exists");
      }
      else{

        let get_time_zone= await this.getTimeZone(latitude ,longitude)
        let dateStamp=await this.getDateAndTimeForStamp(my_time_zone)


        
        var createdLocation = await this.LocationModel.create({
          address,
          created_at:dateStamp, 
          updated_at:dateStamp
        });
        console.log(createdLocation.id);

       this.CoordinatesModel.create({
          longitude,
          latitude,
          created_at:dateStamp, 
          updated_at:dateStamp
        }).then((e)=>{
          console.log(e)
        }).catch((e)=>{
          console.log(e)
        })
        
        

        
            const createdCoordinates = await this.CoordinatesModel.create({
              longitude,
              latitude,
              created_at:dateStamp, 
              updated_at:dateStamp
            });
            const createdFacilityLocation = await this.FacilityLocationModel.create(
              {
                address,
                google_address,
                coordinates_id: createdCoordinates.id,
                operations_area_constraint:operations_area_constraint,
                operations_area_constraint_active:true,
                created_at:dateStamp, 
                updated_at:dateStamp
              }
            );


            const createdFacility = await this.FacilityModel.create({
              customer_id,
              facility_location_id: createdFacilityLocation.id,
              name:site_name,
              client_charge,
              guard_charge,
              time_zone:get_time_zone,
              created_by_id,
              created_at:dateStamp, 
              updated_at:dateStamp
            });
    
        return createdFacility;
      
      }

    }else{
      throw new ConflictError("A user with this email does not exists");
    }
   
  }
  

  async handleUpdateFacility(data: object): Promise<any> {
    const {
      operations_area_constraint,
      client_charge,
      guard_charge,
      site_name,
      facility_location_id,
      site_id
    } = await customerUtil.verifyUpdateFacility.validateAsync(data);


    await this.FacilityModel.update(
    
      {
        client_charge,
        guard_charge,
        name: site_name,
      },
      {
          where:{
              id: site_id
          },
      }
    )

    await this.FacilityLocationModel.update(
      {
        operations_area_constraint,
      },
      {
          where:{
              id: facility_location_id
          },
      }
    )
   
  }

  

  async handleDeleteFacility(data: object): Promise<any> {
    const {
      site_id
    } = await customerUtil.verifyDeleteFacility.validateAsync(data);


    //let lo=await this.FacilityLocationModel.findOne({ where: { id:156} });

    console.log("llllllllllllllllllllllllllllllllllllll")

    console.log(site_id)

    this.FacilityModel.destroy({
        where: {
            id: site_id
        }
    })
    .then(function (deletedRecord) {
        if(deletedRecord === 1){
          console.log("llllllllllllllllllllllllllllllllllllll")

          return "Deleted successfully"
        }
        else
        {
         throw new NotFoundError("record not found");
        }
    })
    .catch(function (error){
      throw new NotFoundError(error);
    });
   
  }

  
  
  async deleteCustomer(data: object): Promise<any> {
    const {
      address_id
    } = await customerUtil.verifyDeleteCustomer.validateAsync(data);
   
        console.log(address_id)

        await this.LocationModel.destroy({
          where:{
            id:address_id
          }
        })
  }
  


  async handleCustomerCreation(data: object): Promise<any> {
    const {
      first_name,
      last_name,
      email,
      image,
      date_of_birth,
      gender,
      address,
      sites,
      phone_number,
      my_time_zone,
      created_by_id
    } = await customerUtil.verifyUserCreationData.validateAsync(data);





    let dateStamp=await this.getDateAndTimeForStamp(my_time_zone)
    var password = authService.generatePassword();
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) {
      throw new SystemError("An error occured while processing your request");
    }
    console.log(hashedPassword);

    var existingUser = await this.getUserByEmail(email);
    console.log(existingUser);
    if (existingUser != null)
      throw new ConflictError("A user with this email already exists");
    var createdLocation = await this.LocationModel.create({
      address,
      created_at:dateStamp, 
      updated_at:dateStamp
    })
    console.log(createdLocation.id);


    const user = await this.UserModel.create({
      first_name,
      last_name,
      email,
      image,
      date_of_birth,
      gender,
      password: hashedPassword,
      location_id: createdLocation.id,
      phone_number, 
      created_by_id, 
      created_at:dateStamp, 
      updated_at:dateStamp
    })
    
    console.log(sites);
    if (sites?.length) {
      const coordinates = [];
      for (const site of sites) {
        // coordinates.push({
        //   longitude: site.longitude,
        //   latitude: site.latitude,
        // });
        const createdCoordinates = await this.CoordinatesModel.create({
          longitude: site.longitude,
          latitude: site.latitude,
        });
        const createdFacilityLocation = await this.FacilityLocationModel.create(
          {
            address: site.address,
            coordinates_id: createdCoordinates.id,
            operations_area_constraint: site.operations_area_constraint,
            operations_area_constraint_active:
              site.operations_area_constraint_active,
          }
        );
        const createdFacility = await this.FacilityModel.create({
          customer_id: user.id,
          facility_location_id: createdFacilityLocation.id,
          name: site.site_name,
          client_charge: site.amount,
        });
      }
      // const createdCoordinates = await this.CoordinatesModel.bulkCreate(
      //   coordinates
      // );
      // const facilityLocations = [];
      // for (var i = 0; i < createdCoordinates.length; i++) {
      //   const coordinate = createdCoordinates[i];
      //   facilityLocations.push({
      //     address: sites[i].site_name,
      //     coordinates_id: createdCoordinates[i].id,
      //   });
      // }
      // const createdFacilityLocations =
      //   await this.FacilityLocationModel.bulkCreate(facilityLocations);
      // const facilities = [];
      // for (var i = 0; i < createdFacilityLocations.length; i++) {
      //   const coordinate = createdFacilityLocations[i];
      //   facilities.push({
      //     customer_id: user.id,
      //     facility_location_id: createdFacilityLocations[i].id,
      //     name: sites[i].address,
      //     client_charge: sites[i].amount,
      //   });
      // }
      // const createdFacilities = await this.FacilityModel.bulkCreate(facilities);
    }
    var transfromedUserObj = await this.transformCustomerForResponse(
      user,
      address,
      sites
    );
    transfromedUserObj.transfromedUser.password = password;
    utilService.updateStat("CUSTOMER_SIGNUP");
    return transfromedUserObj.transfromedUser;
  }

  async handleCustomerCreationBulk(data: any): Promise<any> {
    let res = [];
    for (const customer of data) {
      let val = await this.handleCustomerCreation(customer);
      res.push(val);
    }
    return res;
  }

  async handleGetSingleCustomer(data: any): Promise<any> {

      try {

        var allCustomers = await Customer.findAll({
          where: { id: data },
          include: [
            {
              model: Location,
              as: "location",
            },
            {
              model: Facility,
              as: "facilities",
              include: [
                {
                  model: FacilityLocation,
                  as: "facility_location",
                  include: [
                    {
                      model: Coordinates,
                      as: "coordinates",
                    },
                  ],
                },
              ]
             
            },
          ]
        });
        
        let tempCustomers = [];

        console.log(allCustomers)
        
        allCustomers?.forEach((customer : any) => {
          let tempCustomer = {
            id: customer.id,
            image: customer.image,
            full_name: `${customer.first_name} ${customer.last_name}`,
            first_name: customer.first_name,
            last_name: customer.last_name,
            address: customer.location.address,
            email: customer.email,
            gender: customer.gender,
            date_of_birth: customer.date_of_birth,
          };
          let sites = [];
          customer.facilities?.forEach((facility) => {

            console.log(facility)
            sites.push({
              id: facility.id,
              site_name: facility.name,
              facility_location_id:facility.facility_location_id,
              client_charge: facility.client_charge,
              guard_charge: facility.guard_charge,
              address: facility.facility_location.address,
              latitude: facility.facility_location.coordinates.latitude,
              longitude: facility.facility_location.coordinates.longitude,
              operations_area_constraint:
              facility.facility_location.operations_area_constraint,
              operations_area_constraint_active:
              facility.facility_location.operations_area_constraint_active,
            });
          });
          tempCustomer["sites"] = sites.reverse();
          tempCustomers.push(tempCustomer);
        });
      
        return tempCustomers;
      } catch (error) {
        console.log(error);
        return error;
      }
    
   
  }

  async handleCustomerGetAll(data: any): Promise<any> {

    if(data=="all"){
      try {
        var allCustomers = await Customer.findAll({
          include: [
            {
              model: Location,
              as: "location",
            },
            {
              model: Facility,
              as: "facilities",
              include: [
                {
                  model: FacilityLocation,
                  as: "facility_location",
                  include: [
                    {
                      model: Coordinates,
                      as: "coordinates",
                    },
                  ],
                },
              ],
            },
          ],
          order: [
            ['created_at', 'DESC'],
        ]
        });
        let tempCustomers = [];
        allCustomers?.forEach((customer: any) => {
          let tempCustomer = {
            id: customer.id,
            image: customer.image,
            full_name: `${customer.first_name} ${customer.last_name}`,
            first_name: customer.first_name,
            last_name: customer.last_name,
            address: customer.location.address,
            address_id: customer.location.id,
            email: customer.email,
            gender: customer.gender,
            date_of_birth: customer.date_of_birth,
          };
          let sites = [];
          customer.facilities?.forEach((facility) => {
            sites.push({
              id: facility.id,
              site_name: facility.name,
              amount: facility.client_charge,
              address: facility.facility_location.address,
              latitude: facility.facility_location.coordinates.latitude,
              longitude: facility.facility_location.coordinates.longitude,
              operations_area_constraint:
                facility.facility_location.operations_area_constraint,
              operations_area_constraint_active:
                facility.facility_location.operations_area_constraint_active,
            });
          });
          tempCustomer["sites"] = sites;
          tempCustomers.push(tempCustomer);
        });
        return tempCustomers;
      } catch (error) {
        console.log(error);
        return error;
      }
    }
    else{
      try {


        var allCustomers = await Customer.findAll({
          limit: data.limit,
          offset: data.offset,
          include: [
            {
              model: Location,
              as: "location",
            },
            {
              model: Facility,
              as: "facilities",
              include: [
                {
                  model: FacilityLocation,
                  as: "facility_location",
                  include: [
                    {
                      model: Coordinates,
                      as: "coordinates",
                    },
                  ],
                },
              ],
            },
          ],
          order: [
            ['created_at', 'DESC'],
        ]
        });
        let tempCustomers = [];
        allCustomers?.forEach((customer: any) => {
          let tempCustomer = {
            id: customer.id,
            image: customer.image,
            full_name: `${customer.first_name} ${customer.last_name}`,
            first_name: customer.first_name,
            last_name: customer.last_name,
            address: customer.location.address,
            address_id: customer.location.id,
            email: customer.email,
            gender: customer.gender,
            date_of_birth: customer.date_of_birth,
            phone_number: customer.phone_number,

          };
          let sites = [];
          customer.facilities?.forEach((facility) => {
            sites.push({
              id: facility.id,
              site_name: facility.name,
              amount: facility.client_charge,
              address: facility.facility_location.address,
              latitude: facility.facility_location.coordinates.latitude,
              longitude: facility.facility_location.coordinates.longitude,
              operations_area_constraint:
              facility.facility_location.operations_area_constraint,
              operations_area_constraint_active:
              facility.facility_location.operations_area_constraint_active,
            });
          });
          tempCustomer["sites"] = sites;
          tempCustomers.push(tempCustomer);
        });
        return tempCustomers;
      } catch (error) {
        console.log(error);
        return error;
      }
    }
   
  }

  transformCustomerForResponse(
    data: Customer,
    address,
    sites
  ): { transfromedUser; data: Customer } {
    try {
      var {
        id,
        image,
        first_name,
        last_name,
        email,
        date_of_birth,
        gender,
        created_at,
        updated_at,
        is_archived,
      } = data;

      var transfromedUser = {
        id,
        image,
        first_name,
        last_name,
        email,
        // Added Location
        address,
        sites,
        date_of_birth,
        gender,
        created_at,
        updated_at,
        is_archived,
      };
      return { transfromedUser, data };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getCurrentUser(id: number): Promise<Customer> {
    const user = await this.UserModel.findByPk(id);
    return user;
  }

  async getCurrentUsers(): Promise<Customer[]> {
    const user = await this.UserModel.findAll({
      where: { is_deleted: false } as any,
    });
    return user;
  }

  async getCurrentUserFacilities(id: number): Promise<Facility[]> {
    const facilities = await this.FacilityModel.findAll({
      where: { customer_id: id, is_deleted: false } as any,
    });
    return facilities;
  }

  async getCurrentFacilityLocation(
    facility_id: number
  ): Promise<FacilityLocation> {
    const facilityLocation = await this.FacilityLocationModel.findOne({
      where: { id: facility_id, is_deleted: false } as any,
    });
    return facilityLocation;
  }

  async getCurrentFacilityLocationCoordinates(
    coordinates_id: number
  ): Promise<Coordinates> {
    const coordinates = await this.CoordinatesModel.findOne({
      where: { id: coordinates_id, is_deleted: false } as any,
    });
    return coordinates;
  }

  async parseUsers(): Promise<any> {
    try {
      var users = [];
      var currentUsers = await this.getCurrentUsers();
      for (const user of currentUsers) {
        const facilities = await this.getCurrentUserFacilities(user.id);
        const sites = [];
        for (const facility of facilities) {
          var facilityLocation = await this.getCurrentFacilityLocation(
            facility.id
          );
          if (facilityLocation == null) {
            console.log("Null Facility Detected");
            // await facility.destroy();
            continue;
          }
          var coordinates = await this.getCurrentFacilityLocationCoordinates(
            facilityLocation.id
          );
          if (coordinates == null) {
            console.log("Null Coordinates Detected");
            // facility.destroy();
            // facilityLocation.destroy();
            continue;
          }
          sites.push({
            id: facility.id,
            site_name: facility.name,
            amount: facility.client_charge,
            address: facilityLocation.address,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          });
        }
        var userAddress = await this.getLocationById(user.location_id);
        users.push({
          id: user.id,
          image: user.image,
          first_name: user.first_name,
          last_name: user.last_name,
          address: userAddress.address,
          email: user.email,
          gender: user.gender,
          date_of_birth: user.date_of_birth,
          sites,
        });
      }
      console.log("k: " + users.length);
      return users;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getLocationById(id: number): Promise<Location> {
    return await this.LocationModel.findByPk(id);
  }

  async getUserByEmail(email: string): Promise<Customer> {
    return await this.UserModel.findOne({ where: { email: email } });
  }

  async getsitebyName(name: string,customer_id:number): Promise<Facility> {

    return await this.FacilityModel.findOne(
      {
        where: {[Op.and]: [{name },
        {customer_id}]}
      }
      );
  }


  async getDateAndTimeForStamp(my_time_zone){

    let con_fig_time_zone = momentTimeZone.tz(my_time_zone)
    let date =new Date(con_fig_time_zone.format('YYYY-MM-DD hh:mm:ss a'))
      
     return date
  }

  async getTimeZone(lat: number,log:number) {
    
    let timestamp =moment(new Date()).unix();
    try {
      let response = await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${log}&timestamp=${timestamp}&key=${serverConfig.GOOGLE_KEY}`,
      );
      // console.log(response.data.url);
      // console.log(response.data.explanation);
        console.log(response.data);

      return response.data.timeZoneId;
    } catch (error) {
      console.log(error);
      throw new NotFoundError("Failed to resolve query");
    }
  }



}

export default new CustomerService();
