import { Admin } from "../db/models";
import { NotFoundError } from "../errors";
import { fn, col } from "sequelize";

class UserService {
  private UserModel = Admin;

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

  // async addUserFavorite(userId: number, businessId: number) {
  //   const attributes = { userId, businessId };
  //   await businessService.getByPk(businessId);
  //   const favorite = await this.UserFavoriteModel.create(attributes);
  //   return favorite;
  // }

  // async removeUserFavorite(userId: number, businessId: number) {
  //   const favorite = await this.UserFavoriteModel.destroy({
  //     where: { userId: userId, businessId: businessId },
  //   });
  //   if (!favorite) throw new NotFoundError("User favorite not found.");
  //   return favorite;
  // }

  // async getUserFavorites(
  //   userId: number,
  //   opts: { limit: number; offset: number; search?: string }
  // ) {
  //   const { limit, offset, search } = opts;
  //   const businessIds = await this.UserFavoriteModel.findAll({
  //     where: { userId },
  //     attributes: [[fn("distinct", col("businessId")), "businessId"]],
  //     limit: limit,
  //     offset: offset,
  //   });
  //   const { businesses: favorites, totalCount } =
  //     await businessService.getBusinesses(
  //       businessIds.map(({ businessId }) => businessId),
  //       search
  //     );
  //   return { favorites, totalCount };
  // }
}

export default new UserService();
