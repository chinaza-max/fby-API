import { Statistics } from "../db/models";
import { StatTypes } from "../interfaces/types.interface";
import axios from "axios";
import { NotFoundError } from "../errors";

class UtilService {
  private StatisticsModel = Statistics;

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
}

export default new UtilService();
