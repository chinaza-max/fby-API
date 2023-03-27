import {
  Admin,
  Location,
  PasswordReset,
  License,
  Suspension_comments,
  Customer,
  Schedule,

} from "../db/models";

/*
import {
  Admin as AdminDeleted,
  Location as LocationDeleted,
  PasswordReset as PasswordResetDeleted,
} from "../db/modelsDeleted";

*/
import { ConflictError, NotFoundError, SystemError, UnAuthorizedError } from "../errors";
import { fn, col, Op, and } from "sequelize";
import momentTimeZone from "moment-timezone";
import moment from "moment";
import fs from "fs";
import userUtil from "../utils/user.util";
import serverConfig from "../config/server.config";

class UserService {
  private UserModel = Admin;
  private LocationModel = Location;
  private PasswordResetModel = PasswordReset;
  private LicenseModel = License;
  private Suspension_commentsModel = Suspension_comments;
  private CustomerModel = Customer;
  private ScheduleModel = Schedule;

  /*
  private UserDeletedModel = AdminDeleted;
  private LocationDeletedModel = LocationDeleted;
  private PasswordResetDeletedModel = PasswordResetDeleted;
*/
  async getAllStaffLicense(data) {
    try {
      const { guard_id, my_time_zone } = await userUtil.verifyGetAllStaffLicense.validateAsync(data);

      const AllFoundL = await this.LicenseModel.findAll({
        where: { staff_id: guard_id },
      });
      const all = [];

      if (AllFoundL.length > 0) {
        AllFoundL.filter(async (foundL) => {
          let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);
          if (foundL.approved == true) {
            if (moment(dateStamp).isAfter(foundL.expires_in)) {
              const obj = {
                expiry_date: await this.getDateOnly(foundL.expires_in),
                license_id: foundL.id,
                url: foundL.license,
                status: "Expired",
                Posted: await this.getDateOnly(foundL.updated_at),
              };
              all.push(obj);
            } else {
              const obj = {
                expiry_date: await this.getDateOnly(foundL.expires_in),
                license_id: foundL.id,
                url: foundL.license,
                status: "Approved",
                Posted: await this.getDateOnly(foundL.updated_at),
              };
              all.push(obj);
            }
          } else {
            const obj = {
              expiry_date: await this.getDateOnly(foundL.expires_in),
              license_id: foundL.id,
              url: foundL.license,
              status: "Pending",
              Posted: await this.getDateOnly(foundL.updated_at),
            };

            all.push(obj);
          }
        });
      }

      return all;
    } catch (error) {
      throw new SystemError(error);
    }
  }

  async deleteStaffLicense(body) {
    const { id } = await userUtil.verifyDeleteStaffLicense.validateAsync(body);

    let myUpdate={
      is_deleted:true
    }
    await this.LicenseModel.update(myUpdate,{
      where: {
        id: id,
      },
    });

  }

  async uploadLicense(id: number, data: any, file?: Express.Multer.File) {
    const userUpdateData = await userUtil.verifyUploadLicense.validateAsync(
      data
    );

    let dateStamp = await this.getDateAndTimeForStamp(data.my_time_zone);

    //'/home/fbyteamschedule/public_html/fby-security-api/public/images/avatars/image-1672174934995-161164152-glacier24.jpg',
    //let accessPath = serverConfig.DOMAIN + file.path.replace("public", "");
    let accessPath ='';

      if(serverConfig.NODE_ENV == "production"){
        accessPath =
        serverConfig.DOMAIN +
        file.path.replace("/home/fbyteamschedule/public_html", "");
      }
      else if(serverConfig.NODE_ENV == "development"){
        accessPath =serverConfig.DOMAIN +file.path.replace("public", "");
      }

    const foundL = await this.LicenseModel.findAll({
      where: {
        [Op.and]: [
          { staff_id: id },
          { is_deleted:false},
        ],
      }
    });

    if (foundL.length < 5) {
      const obj = {
        expires_in:data.expires_in,
        staff_id: id,
        time_zone: data.my_time_zone,
        license: accessPath,
        created_at: dateStamp,
        updated_at: dateStamp,
      };

      try {
        await this.LicenseModel.create(obj);
      } catch (error) {
        throw new SystemError(error.toString());
      }
    } else {
      throw new ConflictError("Can't upload license. You already have five")
    }
  }

  async LicenseRUD(data: any) {
    const { id, my_time_zone, type } =
      await userUtil.verifyLicenseRUD.validateAsync(data);
    let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);

    if (type == "approved") {
      const obj = {
        approved: true,
        updated_at: dateStamp,
      };
      await this.LicenseModel.update(obj, {
        where: {
          id: id,
        },
      });
    } else if (type == "delete") {
      await this.LicenseModel.destroy({
        where: {
          id: id,
        },
      });
    } else if (type == "read") {
      const foundL = await this.LicenseModel.findAll({
        where: {
          [Op.and]: [
            { staff_id: id },
            { is_deleted:false},
          ],
        }
      });
      var all = []
      if (foundL.length > 0) {
        for (let i = 0; i < foundL.length; i++) {
          let dateStamp = await this.getDateAndTimeForStamp(data.my_time_zone);

          if(foundL[i].approved==true){

            if (moment(dateStamp).isAfter(foundL[i].expires_in)) {
              const obj = {
                expiry_date: await this.getDateOnly(foundL[i].expires_in),
                license_id: foundL[i].id,
                url: foundL[i].license,
                status: "Expired",
                Posted: await this.getDateOnly(foundL[i].updated_at),
              };
            all.push(obj);
            } else {
              const obj = {
                expiry_date: await this.getDateOnly(foundL[i].expires_in),
                license_id: foundL[i].id,
                url: foundL[i].license,
                status: "Approved",
                Posted: await this.getDateOnly(foundL[i].updated_at),
              };
              all.push(obj);
            }
          }
          else{
            const obj = {
              expiry_date: await this.getDateOnly(foundL[i].expires_in),
              license_id: foundL[i].id,
              url: foundL[i].license,
              status: "Pending",
              Posted: await this.getDateOnly(foundL[i].updated_at),
            };
            all.push(obj);
          }

        }
      }
          
      /*
      else {
        const foundL2 = await this.LicenseModel.findAll({
          where: { [Op.and]: [{ staff_id: id }, { approved: false }] },
        });

        if (foundL2.length > 0) {
          for (let i = 0; i < foundL2.length; i++) {
    
            const obj = {
              expiry_date: await this.getDateOnly(foundL2[i].expires_in),
              license_id: foundL2[i].id,
              url: foundL2[i].license,
              status: "Pending",
              Posted: await this.getDateOnly(foundL2[i].updated_at),
            };

            all.push(obj);
          }
        } 
      }
      */
      return all 
    }
  }

  async updateProfileOtherAdmin(
    id: number,
    data: any,
    file?: Express.Multer.File
  ): Promise<Admin> {
    const userUpdateData =
      await userUtil.verifyUpdateProfileOtherAdmin.validateAsync(data);

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
        let accessPath =''

          if(serverConfig.NODE_ENV == "production"){

            accessPath =serverConfig.DOMAIN +file.path.replace("/home/fbyteamschedule/public_html", "");
  
          }
          else if(serverConfig.NODE_ENV == "development"){
            accessPath =serverConfig.DOMAIN +file.path.replace("public", "");
          }




        await user.update({ image: accessPath });
      }

      var relatedLocation = await this.LocationModel.findOrCreate({
        where: {
          id: user.location_id,
        },
        defaults: {
          address: userUpdateData.address,
        },
      });

      relatedLocation[0].update({
        address: userUpdateData.address,
      });
      user.update({
        first_name: data.first_name,
        last_name: data.last_name,
        location_id: relatedLocation[0].id,
        email: data.email,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        phone_number: data.phone_number,
        role: data.role,
      });
      // await user.update();
      return user;
    }
  }

  async updateUser(
    id: number,
    data: any,
    file?: Express.Multer.File
  ): Promise<Admin> {
    const userUpdateData = await userUtil.verifyUserUpdateData.validateAsync(
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

        ///home/fbyteamschedule/public_html/fby-security-api/app.js

        //https://fbyteamschedule.com/fby-security-api/public/images/avatars/fbyDefaultIMG.png

        let accessPath=''
         

        if(serverConfig.NODE_ENV == "production"){
          accessPath =
          serverConfig.DOMAIN +
          file.path.replace("/home/fbyteamschedule/public_html", "");
        }
        else if(serverConfig.NODE_ENV == "development"){
          accessPath =serverConfig.DOMAIN +file.path.replace("public", "");
        }
        await user.update({ image: accessPath });
      }

      var relatedLocation = await this.LocationModel.findOrCreate({
        where: {
          id: user.location_id,
        },
        defaults: {
          address: userUpdateData.address,
        },
      });

      relatedLocation[0].update({
        address: userUpdateData.address,
      });
      user.update({
        first_name: data.first_name,
        last_name: data.last_name,
        location_id: relatedLocation[0].id,
        email: data.email,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        phone_number: data.phone_number,
        role: data.role,
        suspended: data.staff_status,
      })
      // await user.update();
      return user;
    }
  }

  async deleteStaff(id: any) {



      let foundS = await this.ScheduleModel.findOne({
        where: {
          guard_id:id
        },
      });


      let foundC = await this.Suspension_commentsModel.findOne({
        where: {
          user_id:id
        },
      });


      if(foundS||foundC){
        throw new ConflictError("Cant perform operation")
      }
      else{
       
        let myUpdate={
          is_deleted:true
        }
        await this.UserModel.update(myUpdate,{
          where: {
            id,
          }
        })
       
      }

  }

  async toggleVisibilty(data: any,req: any) {
    let id = data;


    if(req.query.type=="license"){
      const user = await this.UserModel.findByPk(id);

      await this.UserModel.update(
        { availability: !user.availability },
        {
          where: {
            id,
          },
        }
      );
  
  
    }
    else if(req.query.type=="notification"){

      const user = await this.UserModel.findByPk(id);

      await this.UserModel.update(
        { notification: !user.notification },
        {
          where: {
            id,
          },
        }
      );
  
  

    }




  }



  async getAllStaff(data: any) {
      try {
        if (data.role == "ADMIN") {
          var staffs = await this.UserModel.findAll({
            limit: data.limit,
            offset: data.offset,
            where: {
              role: {
                [Op.eq]: "ADMIN",
              },
            },
            include: {
              model: Location,
              as: "location",
            },
            order: [["created_at", "DESC"]],
          });
          if (staffs == null) return [];
          var staffRes = [];
          for (let index = 0; index < staffs.length; index++) {
            const staff = staffs[index];
            const staffData = {
              id: staff.id,
              image: staff.image,
              full_name: `${staff.first_name} ${staff.last_name}`,
              first_name: staff.first_name,
              last_name: staff.last_name,
              email: staff.email,
              date_of_birth: staff.date_of_birth,
              gender: staff.gender,
              phone_number: staff.phone_number,
              address: (staff.location as any)?.address,
              address_id: staff.location["id"],
            };
    
            staffRes.push(staffData);
          }
          return staffRes;
        } else if (data.role == "GUARD") {
          var staffs = await this.UserModel.findAll({
            limit: data.limit,
            offset: data.offset,
            where: {
              role: {
                [Op.eq]: "GUARD",
              },
            },
            include: {
              model: Location,
              as: "location",
            },
            order: [["created_at", "DESC"]],
          });
          if (staffs == null) return [];
          var staffRes = [];
          for (let index = 0; index < staffs.length; index++) {
            const staff = staffs[index];
            const staffData = {
              id: staff.id,
              image: staff.image,
              full_name: `${staff.first_name} ${staff.last_name}`,
              first_name: staff.first_name,
              last_name: staff.last_name,
              email: staff.email,
              date_of_birth: staff.date_of_birth,
              gender: staff.gender,
              phone_number: staff.phone_number,
              address: (staff.location as any)?.address,
              address_id: (staff.location as any)?.id,
            };
            staffRes.push(staffData);
          }
          return staffRes;
        } else if (data.role == "ALL_GUARD") {
          var staffs = await this.UserModel.findAll({
            where: {
              [Op.and]: [
                {role: {
                  [Op.eq]: "GUARD",
                }},
                {is_deleted:false },
              ],
            },
            include: {
              model: Location,
              as: "location",
            },
            order: [["created_at", "DESC"]],
          });
          if (staffs == null) return [];
          var staffRes = [];
          for (let index = 0; index < staffs.length; index++) {
            const staff = staffs[index];
            const staffData = {
              id: staff.id,
              image: staff.image,
              full_name: `${staff.first_name} ${staff.last_name}`,
              first_name: staff.first_name,
              last_name: staff.last_name,
              email: staff.email,
              date_of_birth: staff.date_of_birth,
              gender: staff.gender,
              phone_number: staff.phone_number,
              address: (staff.location as any)?.address,
              address_id: (staff.location as any)?.id,
            };
            staffRes.push(staffData);
          }
          return staffRes;
        } else if (data.role == "ALL_ADMINISTRATORS_AVAILABLE") {
          var staffs = await this.UserModel.findAll({
            limit: data.limit,
            offset: data.offset,
            where: {
              [Op.and]: [
                { suspended: false },
                {
                  role: {
                    [Op.ne]: "GUARD",
                  },
                },
                {is_deleted:false },
              ],
            },
    
            include: {
              model: Location,
              as: "location",
            },
            order: [["created_at", "DESC"]],
          });
          if (staffs == null) return [];
          var staffRes = [];
          for (let index = 0; index < staffs.length; index++) {
            const staff = staffs[index];
            const staffData = {
              id: staff.id,
              image: staff.image,
              full_name: `${staff.first_name} ${staff.last_name}`,
              first_name: staff.first_name,
              last_name: staff.last_name,
              email: staff.email,
              date_of_birth: staff.date_of_birth,
              gender: staff.gender,
              phone_number: staff.phone_number,
              address: (staff.location as any)?.address,
              address_id: staff.location["id"],
            };
    
            staffRes.push(staffData);
          }
          return staffRes;
        } 
        else if (data.role == "ALL_ADMINISTRATORS_AVAILABLE_NO_PAGINATION") {

          var staffs = await this.UserModel.findAll({
            where: {
              [Op.and]: [
                { suspended: false },
                {
                  role: {
                    [Op.ne]: "GUARD",
                  },
                },
                {is_deleted:false },
              ],
            },
            include: {
              model: Location,
              as: "location",
            },
            order: [["created_at", "DESC"]],
          })

          
          if (staffs == null) return [];
          var staffRes = [];
          for (let index = 0; index < staffs.length; index++) {
            const staff = staffs[index];

      
            const staffData = {
              id: staff.id,
              guard_id_for_action: staff.id,
              image: staff.image,
              full_name: `${staff.first_name} ${staff.last_name}`,
              email: staff.email,
              gender: staff.gender,
              phone_number: staff.phone_number,
              address: (staff.location as any)?.address,
              address_id: staff.location["id"],
            };
    
            staffRes.push(staffData);
          }
          return staffRes;
        }
        else if (data.role == "ALL_GUARD_AVAILABLE") {
          var staffs = await this.UserModel.findAll({
            limit: data.limit,
            offset: data.offset,
            where: {
              [Op.and]: [
                { suspended: false },
                {
                  role: {
                    [Op.eq]: "GUARD",
                  },
                },
                {is_deleted:false },
              ],
            },
    
            include: {
              model: Location,
              as: "location",
            },
            order: [["created_at", "DESC"]],
          });
          if (staffs == null) return [];
          var staffRes = [];
          for (let index = 0; index < staffs.length; index++) {
            const staff = staffs[index];
            const staffData = {
              id: staff.id,
              image: staff.image,
              full_name: `${staff.first_name} ${staff.last_name}`,
              first_name: staff.first_name,
              last_name: staff.last_name,
              email: staff.email,
              date_of_birth: staff.date_of_birth,
              gender: staff.gender,
              phone_number: staff.phone_number,
              address: (staff.location as any)?.address,
              address_id: staff.location["id"],
            };
    
            staffRes.push(staffData);
          }
          return staffRes;
        }else if (data.role == "ALL_GUARD_AVAILABLE_NO_PAGINATION") {
          var staffs = await this.UserModel.findAll({
            where: {
              [Op.and]: [
                { suspended: false },
                {
                  role: {
                    [Op.eq]: "GUARD",
                  },
                },
                {is_deleted:false },
              ],
            },
    
            include: {
              model: Location,
              as: "location",
            },
            order: [["created_at", "DESC"]],
          });
          if (staffs == null) return [];
          var staffRes = [];
          for (let index = 0; index < staffs.length; index++) {
            const staff = staffs[index];
            const staffData = {
              id: staff.id,
              guard_id_for_action: staff.id,
              image: staff.image,
              full_name: `${staff.first_name} ${staff.last_name}`,
              email: staff.email,
              gender: staff.gender,
              phone_number: staff.phone_number,
              address: (staff.location as any)?.address,
            };
    
            staffRes.push(staffData);
          }
          return staffRes;
        }
      } catch (error) {
        console.log(error)
        throw new SystemError(error.toString());
      }
  }

  async handleSuspension(data: any) {
    try {
      const { admin_id, body } = data;
      const { user_id, comment } =
        await userUtil.verifySuspension.validateAsync(body);

      const { role, can_suspend } = (
        await this.UserModel.findOne({ where: { id: admin_id } })
      )?.dataValues;

      if (
        role === "SUPER_ADMIN" ||
        (role === "ADMIN" && can_suspend === true)
      ) {
        const user = await this.UserModel.findOne({ where: { id: user_id } });
        if (!user) throw new NotFoundError("user not found");

        if (user.role !== "SUPER_ADMIN") {
          user.update({ suspended: true });
          await this.Suspension_commentsModel.create({
            comment,
            user_id,
            admin_id,
          });
        } else {
          throw new UnAuthorizedError("you can not suspend super admin");
        }
      } else {
        throw new UnAuthorizedError("you are not unauthorized");
      }
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async handleUnSuspension(data: any) {
    try {
      const { admin_id, body } = data;

      const { user_id } = await userUtil.verifyUnSuspension.validateAsync(body);
      const comment = "user has been unsuspened";
      const { role, can_suspend } = (
        await this.UserModel.findOne({ where: { id: admin_id } })
      ).dataValues;

      if (
        role === "SUPER_ADMIN" ||
        (role === "ADMIN" && can_suspend === true)
      ) {
        const user = await this.UserModel.findOne({ where: { id: user_id } });
        if (!user) throw new NotFoundError("user not found");
        user.update({ suspended: false });
        await this.Suspension_commentsModel.create({
          comment,
          user_id,
          admin_id,
        });
      } else {
        throw new UnAuthorizedError("you are not unauthorized");
      }
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async handleSuspensionAuth(data: any) {
    try {
      const { admin_id, body } = data;

      const { user_id } = await userUtil.verifyUnSuspension.validateAsync(body);

      const { role } = (
        await this.UserModel.findOne({ where: { id: admin_id } })
      ).dataValues;

      if (role === "SUPER_ADMIN") {
        const user = await this.UserModel.findOne({ where: { id: user_id } });
        if (user) {
          if (user.role == "GUARD") {
            throw new UnAuthorizedError(
              "Guard cannot be given unauthorization to suspend"
            );
          } else {
            await user.update({ can_suspend: true });
          }
        } else throw new NotFoundError("user not found");
      } else {
        throw new UnAuthorizedError("you are not unauthorized");
      }
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async handleSuspensionUnAuth(data: any) {
    try {
      const { admin_id, body } = data;

      const { user_id } = await userUtil.verifyUnSuspension.validateAsync(body);

      const { role } = (
        await this.UserModel.findOne({ where: { id: admin_id } })
      ).dataValues;

      if (role === "SUPER_ADMIN") {
        const user = await this.UserModel.findOne({ where: { id: user_id } });
        if (user) await user.update({ can_suspend: false });
        else throw new NotFoundError("user not found");
      } else {
        throw new UnAuthorizedError("you are not unauthorized");
      }
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async handleGetSuspendedStaffs(data: any) {
    try {
      if (data.role == "ADMIN") {
        var staffs = await this.UserModel.findAll({
          limit: data.limit,
          offset: data.offset,
          where: {
            [Op.and]: [
              {
                role: {
                  [Op.ne]: "GUARD",
                },
              },
              {
                suspended: true,
              },
            ],
          },
          include: [
            {
              model: Location,
              as: "location",
            },
            {
              model: this.Suspension_commentsModel,
              include: [
                {
                  model: this.UserModel,
                  as: "Admin_details",
                  attributes: ["first_name", "last_name"],
                },
              ],
            },
          ],
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            date_of_birth: staff.date_of_birth,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: staff.location["id"],
            comment:
              staff["Suspension_comments"][
                staff["Suspension_comments"].length - 1
              ],
          };

          staffRes.push(staffData);
        }
        return staffRes;
      } else if (data.role == "GUARD") {
        var staffs = await this.UserModel.findAll({
          limit: data.limit,
          offset: data.offset,
          where: {
            [Op.and]: [
              {
                role: {
                  [Op.eq]: "GUARD",
                },
              },
              {
                suspended: true,
              },
            ],
          },
          include: [
            {
              model: Location,
              as: "location",
            },
            {
              model: this.Suspension_commentsModel,
              include: [
                {
                  model: this.UserModel,
                  as: "Admin_details",
                  attributes: ["first_name", "last_name"],
                },
              ],
            },
          ],
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            date_of_birth: staff.date_of_birth,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: (staff.location as any)?.id,
            comment:
              staff["Suspension_comments"][
                staff["Suspension_comments"].length - 1
              ],
          };
          staffRes.push(staffData);
        }
        return staffRes;
      } else if (data.role == "ALL_GUARD") {
        var staffs = await this.UserModel.findAll({
          where: {
            [Op.and]: [
              {
                role: {
                  [Op.eq]: "GUARD",
                },
              },
              {
                suspended: true,
              },
            ],
          },
          include: [
            {
              model: Location,
              as: "location",
            },
            {
              model: this.Suspension_commentsModel,
              // as: "suspension_comments",
              include: [
                {
                  model: this.UserModel,
                  as: "Admin_details",
                  attributes: ["first_name", "last_name"],
                },
              ],
            },
          ],
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            date_of_birth: staff.date_of_birth,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: (staff.location as any)?.id,
            comment:
              staff["Suspension_comments"][
                staff["Suspension_comments"].length - 1
              ],
          };
          staffRes.push(staffData);
        }
        return staffRes;
      }
    } catch (error) {
      throw new SystemError(error);
    }
  }

  async handleGetDeletedStaffs(data: any) {



    try {
      if (data.role == "ADMIN") {
        var staffs = await this.UserModel.findAll({
          limit: data.limit,
          offset: data.offset,
          where: {
            role: {
              [Op.eq]: "ADMIN",
            },
          },
          include: {
            model: Location,
            as: "location",
          },
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            date_of_birth: staff.date_of_birth,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: staff.location["id"],
          };
  
          staffRes.push(staffData);
        }
        return staffRes;
      } else if (data.role == "GUARD") {
        var staffs = await this.UserModel.findAll({
          limit: data.limit,
          offset: data.offset,
          where: {
            role: {
              [Op.eq]: "GUARD",
            },
          },
          include: {
            model: Location,
            as: "location",
          },
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            date_of_birth: staff.date_of_birth,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: (staff.location as any)?.id,
          };
          staffRes.push(staffData);
        }
        return staffRes;
      } else if (data.role == "ALL_GUARD") {
        var staffs = await this.UserModel.findAll({
          where: {
            [Op.and]: [
              {role: {
                [Op.eq]: "GUARD",
              }},
              {is_deleted:false },
            ],
          },
          include: {
            model: Location,
            as: "location",
          },
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            date_of_birth: staff.date_of_birth,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: (staff.location as any)?.id,
          };
          staffRes.push(staffData);
        }
        return staffRes;
      } else if (data.role == "ALL_ADMINISTRATORS_AVAILABLE") {
        var staffs = await this.UserModel.findAll({
          limit: data.limit,
          offset: data.offset,
          where: {
            [Op.and]: [
              { suspended: false },
              {
                role: {
                  [Op.ne]: "GUARD",
                },
              },
              {is_deleted:false },
            ],
          },
  
          include: {
            model: Location,
            as: "location",
          },
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            date_of_birth: staff.date_of_birth,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: staff.location["id"],
          };
  
          staffRes.push(staffData);
        }
        return staffRes;
      } 
      else if (data.role == "ALL_ADMINISTRATORS_AVAILABLE_NO_PAGINATION") {

        var staffs = await this.UserModel.findAll({
          where: {
            [Op.and]: [
              {
                role: {
                  [Op.ne]: "GUARD",
                },
              },
              {is_deleted:true },
            ],
          },
          include: {
            model: Location,
            as: "location",
          },
          order: [["created_at", "DESC"]],
        })

        
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];

    
          const staffData = {
            id: staff.id,
            guard_id_for_action: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            email: staff.email,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: staff.location["id"],
          };
  
          staffRes.push(staffData);
        }
        return staffRes;
      }
      else if (data.role == "ALL_GUARD_AVAILABLE") {
        var staffs = await this.UserModel.findAll({
          limit: data.limit,
          offset: data.offset,
          where: {
            [Op.and]: [
              { suspended: false },
              {
                role: {
                  [Op.eq]: "GUARD",
                },
              },
              {is_deleted:false },
            ],
          },
  
          include: {
            model: Location,
            as: "location",
          },
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            date_of_birth: staff.date_of_birth,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: staff.location["id"],
          };
  
          staffRes.push(staffData);
        }
        return staffRes;
      }else if (data.role == "ALL_GUARD_AVAILABLE_NO_PAGINATION") {
        var staffs = await this.UserModel.findAll({
          where: {
            [Op.and]: [
              {
                role: {
                  [Op.eq]: "GUARD",
                },
              },
              {is_deleted:true},
            ],
          },
  
          include: {
            model: Location,
            as: "location",
          },
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            guard_id_for_action: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            email: staff.email,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
          };
  
          staffRes.push(staffData);
        }
        return staffRes;
      }
    } catch (error) {
      console.log(error)
      throw new SystemError(error.toString());
    }

/*
    try {
      if (data.role == "ADMIN") {
        var staffs = await this.UserDeletedModel.findAll({
         
          where: {
                role: {
                  [Op.ne]: "GUARD",
                },
              },
              
          include: 
            {
              model: this.LocationDeletedModel,
              as: "location",
            }
          ,
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            date_of_birth: staff.date_of_birth,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: staff.location["id"]
          };

          staffRes.push(staffData);
        }
        return staffRes;
      } else if (data.role == "GUARD") {
        var staffs = await this.UserDeletedModel.findAll({
         
          where: {
                role: {
                  [Op.eq]: "GUARD",
                },
              
          },
          include:
            {
              model: LocationDeleted,
              as: "location",
            },
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            date_of_birth: staff.date_of_birth,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: (staff.location as any)?.id,
          };
          staffRes.push(staffData);
        }
        return staffRes;
      } else if (data.role == "ALL_GUARD") {
        var staffs = await this.UserDeletedModel.findAll({
          where: {
  
                role: {
                  [Op.eq]: "GUARD",
                },
              },
          include: 
            {
              model: LocationDeleted,
              as: "location",
            },
          order: [["created_at", "DESC"]],
        });
        if (staffs == null) return [];
        var staffRes = [];
        for (let index = 0; index < staffs.length; index++) {
          const staff = staffs[index];
          const staffData = {
            id: staff.id,
            image: staff.image,
            full_name: `${staff.first_name} ${staff.last_name}`,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            date_of_birth: staff.date_of_birth,
            gender: staff.gender,
            phone_number: staff.phone_number,
            address: (staff.location as any)?.address,
            address_id: (staff.location as any)?.id
          };
          staffRes.push(staffData);
        }
        return staffRes;
      }
    } catch (error) {
      throw new SystemError(error);
    }

    */
  }

  async getDateAndTimeForStamp(my_time_zone) {
    let con_fig_time_zone = momentTimeZone.tz(my_time_zone);
    let date = new Date(con_fig_time_zone.format("YYYY-MM-DD hh:mm:ss a"));

    return date;
  }

  async getDateAndTime(val) {
    return moment(val).format("YYYY-MM-DD hh:mm:ss a");
  }

  async getDateOnly(val) {
    return moment(val).format("YYYY-MM-DD");
  }

  async getTimeOnly(val) {
    return moment(val).format("hh:mm:ss a");
  }
}

export default new UserService();
