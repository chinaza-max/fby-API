import {
  Admin,
  Coordinates,
  Customer,
  Facility,
  FacilityLocation,
  Location,
  Customer_suspension_comments,
} from "../db/models";
import {
  Facility as FacilityDeleted,
  Location as LocationDeleted,
} from "../db/modelsDeleted";
import axios from "axios";
import serverConfig from "../config/server.config";
import customerUtil from "../utils/customer.util";
import IAdmin from "../interfaces/admin.interface";
import bcrypt from "bcrypt";
import { ConflictError, SystemError, NotFoundError, UnAuthorizedError } from "../errors";
import authService from "./auth.service";
import ICustomer from "../interfaces/customer.interface";
import utilService from "./util.service";
import { fn, col, Op, QueryError, where } from "sequelize";
import { date, string } from "joi";
import momentTimeZone from "moment-timezone";
import moment from "moment";

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
  private Customer_suspension_commentsModel = Customer_suspension_comments;
  private AdminModel = Admin

  private LocationDeletedModel = LocationDeleted;
  private FacilityDeletedModel = FacilityDeleted;

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
      created_by_id,
    } = await customerUtil.verifyFacilityCreation.validateAsync(data);

    var existingUser = await this.getUserByEmail(email);
    if (existingUser != null) {
      var existingSite = await this.getsitebyName(site_name, customer_id);

      if (existingSite != null) {
        throw new ConflictError("Site name exists");
      } else {
        let get_time_zone = await this.getTimeZone(latitude, longitude);
        let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);

        var createdLocation = await this.LocationModel.create({
          address,
          created_at: dateStamp,
          updated_at: dateStamp,
        });
        console.log(createdLocation.id);

        this.CoordinatesModel.create({
          longitude,
          latitude,
          created_at: dateStamp,
          updated_at: dateStamp,
        })
          .then((e) => {
            console.log(e);
          })
          .catch((e) => {
            console.log(e);
          });

        const createdCoordinates = await this.CoordinatesModel.create({
          longitude,
          latitude,
          created_at: dateStamp,
          updated_at: dateStamp,
        });
        const createdFacilityLocation = await this.FacilityLocationModel.create(
          {
            address,
            google_address,
            coordinates_id: createdCoordinates.id,
            operations_area_constraint: operations_area_constraint,
            operations_area_constraint_active: true,
            created_at: dateStamp,
            updated_at: dateStamp,
          }
        );

        const createdFacility = await this.FacilityModel.create({
          customer_id,
          facility_location_id: createdFacilityLocation.id,
          name: site_name,
          client_charge,
          guard_charge,
          time_zone: get_time_zone,
          created_by_id,
          created_at: dateStamp,
          updated_at: dateStamp,
        });

        return createdFacility;
      }
    } else {
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
      site_id,
    } = await customerUtil.verifyUpdateFacility.validateAsync(data);

    await this.FacilityModel.update(
      {
        client_charge,
        guard_charge,
        name: site_name,
      },
      {
        where: {
          id: site_id,
        },
      }
    );

    await this.FacilityLocationModel.update(
      {
        operations_area_constraint,
      },
      {
        where: {
          id: facility_location_id,
        },
      }
    );
  }

  async handleDeleteFacility(data: object): Promise<any> {
    const { site_id } = await customerUtil.verifyDeleteFacility.validateAsync(
      data
    );

    //let lo=await this.FacilityLocationModel.findOne({ where: { id:156} });

    console.log("llllllllllllllllllllllllllllllllllllll");

    console.log(site_id);
    try {
      const record = await this.FacilityModel.findOne({
        where: {
          id: site_id,
        },
      });
      if (record) {
        console.log(record);
        const deleted_faclilty = await this.FacilityDeletedModel.create(
          record.dataValues
        );
      }

      this.FacilityModel.destroy({
        where: {
          id: site_id,
        },
      })
        .then(function (deletedRecord) {
          console.log(deletedRecord)
          if (deletedRecord === 1) {
            console.log("llllllllllllllllllllllllllllllllllllll");

            return "Deleted successfully";
          } else {
            throw new NotFoundError("record not found");
          }
        })
        .catch(function (error) {
          throw new NotFoundError(error);
        });
    } catch (error) {
      this.FacilityDeletedModel.destroy({
        where: {
          id: site_id,
        },
      });
      {
        throw new SystemError(error.toString());
      }
    }
  }

  async deleteCustomer(data: object): Promise<any> {
    const { address_id } =
      await customerUtil.verifyDeleteCustomer.validateAsync(data);

    console.log(address_id);
    try {
      const record = await this.LocationModel.findOne({
        where: {
          id: address_id,
        },
      });
      if (record) {
        const deleted_Location = await this.LocationDeletedModel.create(
          record.dataValues
        );
      }
    } catch (error) {
      {
        throw new NotFoundError(error);
      }
    }
    await this.LocationModel.destroy({
      where: {
        id: address_id,
      },
    });
  }

  async handleCustomerCreation(data: object): Promise<any> {
    const {
      company_name,
      email,
      image,
      gender,
      address,
      phone_number,
      my_time_zone,
      created_by_id,
    } = await customerUtil.verifyUserCreationData.validateAsync(data);

    let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);
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

    var existingUser = await this.getUserByEmail(email);
    console.log(existingUser);
    if (existingUser != null)
      throw new ConflictError("A user with this email already exists");
    var createdLocation = await this.LocationModel.create({
      address,
      created_at: dateStamp,
      updated_at: dateStamp,
    });
    console.log(createdLocation.id);

    const user = await this.UserModel.create({
      company_name,
      email,
      image,
      gender,
      password: hashedPassword,
      location_id: createdLocation.id,
      phone_number,
      created_by_id,
      created_at: dateStamp,
      updated_at: dateStamp,
    });

 
    var transfromedUserObj = await this.transformCustomerForResponse(
      user,
      address
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


  
  async getAllSiteOrSingleSite(data: any): Promise<any> {

    let mytype=data.query.type
      
    try {

      if(mytype=='allSite'){

        /** */
      }
      else if(mytype=='singleSite'){
          let foundF=await this.FacilityModel.findOne({
            where:{
              id:data.query.id
            }
          })
          let foundL=await this.FacilityLocationModel.findOne({
            where:{
              id:foundF.facility_location_id
            }
          })

          let foundFC=await this.CoordinatesModel.findOne({
            where:{
              id:foundL.coordinates_id
            }
          })

          let obj={
            id: foundF.id,
            site_name: foundF.name,
            facility_location_id:foundL.id,
            client_charge: foundF.client_charge,
            guard_charge: foundF.guard_charge,
            address: foundL.address,
            latitude: foundFC.latitude,
            longitude: foundFC.longitude,
            operations_area_constraint:foundL.operations_area_constraint,
            operations_area_constraint_active:foundL.operations_area_constraint_active,
          }
          return obj;
      }

    
    } catch (error) {
      console.log(error);
      return error;
    }
  
 
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
            ],
          },
        ],
      });

      let tempCustomers = [];

      allCustomers?.forEach((customer: any) => {
        let tempCustomer = {
          id: customer.id,
          image: customer.image,
          company_name: customer.company_name,
          tel: customer.phone_number,
          address: customer.location.address,
          email: customer.email,
          gender: customer.gender,
        };
        let sites = [];
        customer.facilities?.forEach((facility) => {
          sites.push({
            id: facility.id,
            site_name: facility.name,
            facility_location_id: facility.facility_location_id,
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
    if (data == "all") {
      try {
        var allCustomers = await Customer.findAll({
          where: {suspended: false},
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
          order: [["created_at", "DESC"]],
        });
        let tempCustomers = [];
        allCustomers?.forEach((customer: any) => {
          let tempCustomer = {
            id: customer.id,
            image: customer.image,
            company_name: customer.company_name,
            address: customer.location.address,
            address_id: customer.location.id,
            email: customer.email,
            gender: customer.gender,
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
    } else {
      try {
        var allCustomers = await Customer.findAll({
          where: {suspended: false},
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
          order: [["created_at", "DESC"]],
        });
        let tempCustomers = [];
        allCustomers?.forEach((customer: any) => {
          let tempCustomer = {
            id: customer.id,
            image: customer.image,
            company_name: customer.company_name,
            address: customer.location.address,
            address_id: customer.location.id,
            email: customer.email,
            gender: customer.gender,
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

  ): { transfromedUser; data: Customer } {
    try {
      var {
        id,
        image,
        company_name,
        email,
        gender,
        created_at,
        updated_at,
        is_archived,
      } = data;

      var transfromedUser = {
        id,
        image,
        company_name,
        email,
        // Added Location
        address,
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
          company_name: user.company_name,
          address: userAddress.address,
          email: user.email,
          gender: user.gender,
          sites
        });
      }
      return users;
    } catch (error) {
      console.log(error);
      return [];
    }
  }


  async updateProfile(
    id: number,
    data: any,
    file?: Express.Multer.File
  ): Promise<Customer> {
    const userUpdateData = await customerUtil.verifyUpdateProfile.validateAsync(
      data
    );
    const user = await this.UserModel.findByPk(id);

    if (!user) throw new NotFoundError("User not found.");

    try {
      /*
        var filePath =global.__basedir+"\\"+"public"+user.image.slice(serverConfig.DOMAIN.length, user.image.length); 
    
        if(filePath.includes("fbyDefaultIMG.png")){
        }
        else{
        fs.unlinkSync(filePath);
        }

        */
    } finally {
      if (file) {
        /*let accessPath =
          serverConfig.DOMAIN +
          file.path.replace("/home/fbyteamschedule/public_html", "");
*/
          let accessPath =
          serverConfig.DOMAIN +
          file.path.replace("public", "");

        await user.update({ image: accessPath });
      }

     


      var relatedLocation = await this.LocationModel.findOrCreate({
        where: {
          id: user.location_id,
        },
        defaults: {
          address: userUpdateData.address,
        },
      })

      relatedLocation[0].update({
        address: userUpdateData.address,
      });

      console.log("data")
      console.log(data)
      console.log("data")

      user.update({
        company_name: data.company_name,
        location_id: relatedLocation[0].id,
        email: data.email,
        gender: data.gender,
        phone_number: data.phone_number,
      });
      // await user.update();
      return user;
    }
  }

  async handleSuspensionOfCustomer(data: any) {
    // try {
      const { admin_id, body } = data;

      const { customer_id, comment } =
        await customerUtil.verifyCustomerSuspension.validateAsync(body);

      const { role, can_suspend } = (
        await this.AdminModel.findOne({ where: { id: admin_id } })
      ).dataValues;

      if (
        role === "SUPER_ADMIN" ||
        (role === "ADMIN" && can_suspend === true)
      ) {
        const user = await this.UserModel.findOne({
          where: { id: customer_id },
        });
        if (user) {
          user.update({ suspended: true });
          await this.Customer_suspension_commentsModel.create({
            comment,
            customer_id,
            admin_id,
          });
        } else {
          throw new NotFoundError("user not found");
        }
      } else {
        throw new UnAuthorizedError("you are not unauthorized");
      }
    // } catch (error) {
    //   console.log(error.message)
    //   //throw new SystemError(error.toString());
    // }
  }

  async handleUnSuspensionOfCustomer(data: any) {
    try {
      const { admin_id, body } = data;

      const { customer_id } =
        await customerUtil.verifyCustomerUnSuspension.validateAsync(body);
      const comment = "user has been unsuspened";
      const { role, can_suspend } = (
        await this.AdminModel.findOne({ where: { id: admin_id } })
      ).dataValues;

      if (
        role === "SUPER_ADMIN" ||
        (role === "ADMIN" && can_suspend === true)
      ) {
        const user = await this.UserModel.findOne({
          where: { id: customer_id },
        });
        if (user) {
          user.update({ suspended: false });
        } else {
          throw new NotFoundError("user not found");
        }

        await this.Customer_suspension_commentsModel.create({
          comment,
          customer_id,
          admin_id,
        });
      } else {
        throw new UnAuthorizedError("you are not unauthorized");
      }
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async handleGetSuspendedCustomers(data) {
    try {
      var allCustomers = await Customer.findAll({
        where: {suspended: true},
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
          {
            model: this.Customer_suspension_commentsModel,
            include: [
              {
              model: this.UserModel,
              as: "Admin_details",
              attributes: ["first_name", "last_name"]}
            ]          
          }
        ],
        order: [["created_at", "DESC"]],
      });
      let tempCustomers = [];
      allCustomers?.forEach((customer: any) => {
        let tempCustomer = {
          id: customer.id,
          image: customer.image,
          company_name: customer.company_name,
          address: customer.location.address,
          address_id: customer.location.id,
          email: customer.email,
          gender: customer.gender,
          phone_number: customer.phone_number,
          comment: customer.Customer_suspension_comments[customer.Customer_suspension_comments.length -1]
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

  async getLocationById(id: number): Promise<Location> {
    return await this.LocationModel.findByPk(id);
  }

  async getUserByEmail(email: string): Promise<Customer> {
    return await this.UserModel.findOne({ where: { email: email } });
  }

  async getsitebyName(name: string, customer_id: number): Promise<Facility> {
    return await this.FacilityModel.findOne({
      where: { [Op.and]: [{ name }, { customer_id }] },
    });
  }

  async getDateAndTimeForStamp(my_time_zone) {
    let con_fig_time_zone = momentTimeZone.tz(my_time_zone);
    let date = new Date(con_fig_time_zone.format("YYYY-MM-DD hh:mm:ss a"));

    return date;
  }

  async getTimeZone(lat: number, log: number) {
    let timestamp = moment(new Date()).unix();
    try {
      let response = await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${log}&timestamp=${timestamp}&key=${serverConfig.GOOGLE_KEY}`
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
