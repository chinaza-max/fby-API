import { Router } from "express";
import { func } from "joi";
import {
  UserController,
} from "../controllers/user/index";
import uploadHandler from "../middlewares/upload.middleware";

class UserRoutes extends UserController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/updateProfile" ,uploadHandler.avatars.single("image"), this.update);
    this.router.post("/updateProfileOtherAdmin" ,uploadHandler.avatars.single("image"), this.updateProfileOtherAdmin);
    this.router.post("/updateProfileGuard" ,uploadHandler.avatars.single("image"), this.updateGuard);
    this.router.post("/uploadLicense", uploadHandler.uploads.single("file"), this.uploadLicense);
    
    this.router.post("/getAllStaffLicense" , this.getAllStaffLicense);
    this.router.post("/deleteStaffLicense",  this.deleteStaffLicense);
    
    this.router.post("/LicenseRUD", this.LicenseRUD);
    this.router.get("/getAllStaff", this.getAllStaff);
    this.router.post("/deleteStaff", this.deleteStaff);
    this.router.post("/toggleVisibilty", this.toggleVisibilty);
    this.router.post("/suspend_user_account", this.suspendAccount);
    this.router.post("/unsuspend_user_account", this.UnsuspendAccount);
    this.router.post("/suspend_account_authorization", this.suspendAccountAuthorization);
    this.router.post("/suspend_account_unauthorization", this.suspendAccountUnAuthorization);
    this.router.get("/suspended_staffs", this.getSuspendedStaffs)
  }
}




export default new UserRoutes().router;
