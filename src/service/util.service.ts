import { Statistics } from "../db/models";
import { StatTypes } from "../interfaces/types.interface";

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
        value: 0
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
}

export default new UtilService();
