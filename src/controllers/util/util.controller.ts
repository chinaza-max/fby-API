import { Request, Response, NextFunction } from "express";
import utilService from "../../service/util.service";

export default class UtilController {
  protected async googleMapsAutoComplete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const val = await utilService.googleMapsAutoComplete(data);

      return res.status(200).json({
        status: 200,
        message: "Results Retrieved Successfully",
        data: val,
      });
    } catch (error) {
      next(error);
    }
  }
  protected async googleMapsLocationSearch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const val = await utilService.googleMapsLocationSearch(data);

      return res.status(200).json({
        status: 200,
        message: "Results Retrieved Successfully",
        data: val,
      });
    } catch (error) {
      next(error);
    }
  }
}
