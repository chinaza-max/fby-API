// import { Request, Response, NextFunction } from "express";
// import userService from "../../../service/user.service";
// import debug from "debug";
// const DEBUG = debug("dev");
// export default class UserFavoriteController {
//   protected async create(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<Response> {
//     try {
//       const { businessId } = req.body;
//       const { id: userId } = req.user;
//       const favorite = await userService.addUserFavorite(
//         userId,
//         Number(businessId)
//       );
//       return res.status(200).json({
//         status: 200,
//         message: "Added to favorites.",
//         data: favorite,
//       });
//     } catch (error) {
//       DEBUG(`Error in creating user favorite: ${error}`);
//       next(error);
//     }
//   }
//   protected async getAll(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<Response> {
//     try {
//       const { limit = 10, offset = 0 } = req.query;
//       const { id: userId } = req.user;
//       const search = req.query.search as string;
//       const opts: { search: string; limit: number; offset: number } = {
//         search,
//         limit: Number(limit),
//         offset: Number(offset),
//       };
//       const { favorites, totalCount } = await userService.getUserFavorites(
//         userId,
//         opts
//       );
//       return res.status(200).json({
//         status: 200,
//         data: { result: favorites, totalCount },
//       });
//     } catch (error) {
//       DEBUG(`Error in getting user favorites: ${error}`);
//       next(error);
//     }
//   }
//   protected async delete(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<Response> {
//     try {
//       const { businessId } = req.params;
//       const { id: userId } = req.user;
//       await userService.removeUserFavorite(userId, Number(businessId));
//       return res.status(200).json({
//         status: 200,
//         message: "Removed from favorites.",
//       });
//     } catch (error) {
//       DEBUG(`Error in deleting user favorite: ${error}`);
//       next(error);
//     }
//   }
// }
//# sourceMappingURL=userFavorite.controller.js.map