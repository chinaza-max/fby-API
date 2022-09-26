import { Admin, Location } from "../db/models";
import { NotFoundError } from "../errors";
import { fn, col, Op } from "sequelize";

class UserService {
  private UserModel = Admin;
  private LocationModel = Location;

  async updateUser(
    id: number,
    doc: object,
    file?: Express.Multer.File
  ): Promise<Admin> {
    const user = await this.UserModel.findByPk(id);
    if (!user) throw new NotFoundError("User not found.");
    if (file) await user.update({ image: file.path });
    await user.update(doc);
    return user;
  }

  async getAllStaff() {
    var staffs = await this.UserModel.findAll({
      where: {
        role: {
          [Op.eq]: null,
        },
      },
    });
    console.log(staffs);
    if (staffs == null) return [];
    var staffRes = [];
    for (let index = 0; index < staffs.length; index++) {
      const staff = staffs[index];
      const location = await this.LocationModel.findByPk(staff.location_id);
      const staffData = {
        id: staff.id,
        image: staff.image,
        first_name: staff.first_name,
        last_name: staff.last_name,
        email: staff.email,
        date_of_birth: staff.date_of_birth,
        gender: staff.gender,
        address: location.address,
      };
      staffRes.push(staffData);
    }
    return staffRes;
  }
}

export default new UserService();
