import { Statistics,Subscriptions,Admin} from "../db/models";
import { StatTypes } from "../interfaces/types.interface";
import axios from "axios";
import momentTimeZone from "moment-timezone";
import { NotFoundError ,SystemError} from "../errors";
import userUtil from "../utils/user.util";

class UtilService {
  private StatisticsModel = Statistics;
  private SubscriptionsModel = Subscriptions;
  private AdminsModel = Admin;



  async updateStat(stat_type: StatTypes): Promise<any> {
    let now = new Date();
    let currentMonth = now.getMonth() + 1;
    let currentYear = now.getFullYear();
    let currentStat = await this.StatisticsModel.findOrCreate({
      where: {
        month: currentMonth,
        year: currentYear,
        stat_type: stat_type,
      },
      defaults: {
        month: currentMonth,
        year: currentYear,
        stat_type: stat_type,
        value: 0,
      },
    });
    currentStat[0]?.update({
      value: (currentStat[0]?.value ?? 0) + 1,
    });
    return "success";
    // return user;
  }

  async decrementStat(stat_type: StatTypes): Promise<any> {
    let now = new Date();
    let currentMonth = now.getMonth() + 1;
    let currentYear = now.getFullYear();
    let currentStat = await this.StatisticsModel.findOrCreate({
      where: {
        month: currentMonth,
        year: currentYear,
        stat_type: stat_type,
      },
      defaults: {
        month: currentMonth,
        year: currentYear,
        stat_type: stat_type,
      },
    });
    currentStat[0]?.update({
      value:
        (currentStat[0]?.value ?? 0) === 0
          ? 0
          : (currentStat[0]?.value ?? 0) - 1,
    });
    return "success";
    // return user;
  }

  async googleMapsAutoComplete(value) {
    try {
      let response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value.searchQuery}&key=AIzaSyAqoyaPtHf5BcoTX_iNvCzXjVj6BpGl2do`
      );
      // console.log(response.data.url);
      // console.log(response.data.explanation);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new NotFoundError("Failed to resolve query");
    }
  }

  async googleMapsLocationSearch(value) {
    try {
      let response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${value.searchQuery}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=AIzaSyAqoyaPtHf5BcoTX_iNvCzXjVj6BpGl2do`
      );
      // console.log(response.data.url);
      // console.log(response.data.explanation);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new NotFoundError("Failed to resolve query");
    }
  }


  async subscription(data){

    try {
      const {
        subscription,
        my_time_zone,
        guard_id,
      } = await userUtil.verifySubscription.validateAsync(data);

      let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);
     

      const foundA=await this.SubscriptionsModel.findOne({
        where:{
            guard_id
        }
      })

      if(!foundA){

        let obj={
          guard_id,
          subscription,
          created_at: dateStamp,
          updated_at: dateStamp
        }

        this.SubscriptionsModel.create(obj)
      }
      else{

        let obj={
          guard_id,
          subscription,
          updated_at: dateStamp,
        }

        console.log(guard_id)

        this.SubscriptionsModel.update(obj,
            {where:{guard_id}})
           
      }

    } catch (error) {


      console.log("succefull succefull succefull  succefull ")
              console.log("succefull succefull succefull  succefull ")
              console.log(error);

              console.log("succefull succefull succefull  succefull ")
              console.log("succefull succefull succefull  succefull ")  
      throw new SystemError(error.toString());
    }
  }





  async getDateAndTimeForStamp(my_time_zone) {
    let con_fig_time_zone = momentTimeZone.tz(my_time_zone);
    let date = new Date(con_fig_time_zone.format("YYYY-MM-DD hh:mm:ss a"));

    return date;
  }
}

export default new UtilService();
