import { Admin, Location, PasswordReset } from "../db/models";
import { NotFoundError } from "../errors";
import { fn, col, Op } from "sequelize";
import  fs from 'fs';
import userUtil from "../utils/user.util";
import serverConfig from "../config/server.config";


class UserService {
  private UserModel = Admin;
  private LocationModel = Location;
  private PasswordResetModel =PasswordReset


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

    try{
        
        var filePath =global.__basedir+"\\"+"public"+user.image.slice(serverConfig.DOMAIN.length, user.image.length); 
    
        if(filePath.includes("fbyDefaultIMG.png")){
        }
        else{
        fs.unlinkSync(filePath);
        }
    }
    finally {
    
    if (file){
      await user.update({ image:serverConfig.DOMAIN+file.path.slice(6, file.path.length) });
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
      phone_number:data.phone_number
    });
    // await user.update();
    return user;
  }
  }
  
  async deleteStaff(address_id: any) {

    let foundU=await this.UserModel.findOne({
                where:{
                  location_id:address_id
                }
              });

    
    let foundP=  await this.PasswordResetModel.findOne({
          where:{
            user_id:foundU.id }
        });  

    if(foundP){
      await this.PasswordResetModel.destroy({
        where:{user_id:foundU.id}
      });  
    }   
      

    await this.LocationModel.destroy({
      where:{
        id:address_id
      }
    });

}



async toggleVisibilty(data: any) {

    let id=data

    const user = await this.UserModel.findByPk(id);


    console.log(user.availability)

    await this.UserModel.update({ availability:!user.availability},{
      where:{
        id
      }
    });

}

  async getAllStaff(data: any) {

      console.log(data.role)

    if(data.role=="ADMIN"){
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
        order: [
          ['created_at', 'DESC'],
      ]
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
    else if(data.role=="GUARD"){
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
        order: [
          ['created_at', 'DESC'],
      ]
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
    }

  }
}

export default new UserService();
