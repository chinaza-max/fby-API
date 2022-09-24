import {
  Admin,
  Coordinates,
  Customer,
  Facility,
  FacilityLocation,
  Location,
} from "../db/models";
import serverConfig from "../config/server.config";
import customerUtil from "../utils/customer.util";
import IAdmin from "../interfaces/admin.interface";
import bcrypt from "bcrypt";
import { ConflictError, SystemError } from "../errors";
import authService from "./auth.service";
import ICustomer from "../interfaces/customer.interface";

interface DecodedToken {
  payload: ICustomer | null;
  expired: boolean | string | Error;
}

class AuthenticationService {
  private UserModel = Customer;
  private LocationModel = Location;
  private CoordinatesModel = Coordinates;
  private FacilityModel = Facility;
  private FacilityLocationModel = FacilityLocation;

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
    } = await customerUtil.verifyUserCreationData.validateAsync(data);
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
      address: address,
    });
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
    });
    if (sites?.length) {
      const coordinates = [];
      sites.forEach(async (site) => {
        coordinates.push({
          longitude: site.longitude,
          latitude: site.latitude,
        });
        const createdCoordinates = await this.CoordinatesModel.create({
          longitude: site.longitude,
          latitude: site.latitude,
        });
        const createdFacilityLocation = await this.FacilityLocationModel.create(
          {
            address: site.site_name,
            coordinates_id: createdCoordinates.id,
          }
        );
        const createdFacility = await this.FacilityModel.create({
          customer_id: user.id,
          facility_location_id: createdFacilityLocation.id,
          name: site.address,
          client_charge: site.amount,
        });
      });
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
    return transfromedUserObj;
  }

  async handleCustomerGetAll(): Promise<any> {
    try {
      return await this.parseUsers();
    } catch (error) {
      return error;
    }
  }

  transformCustomerForResponse(
    data: Customer,
    address: String,
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
          if(facilityLocation == null) {
            console.log("Null Facility Detected");
            await facility.destroy();
            continue;
          }
          var coordinates = await this.getCurrentFacilityLocationCoordinates(
            facilityLocation.id
          );
          if(coordinates == null) {
            console.log("Null Coordinates Detected");
            facility.destroy();
            facilityLocation.destroy();
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
}

export default new AuthenticationService();
