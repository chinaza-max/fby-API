"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../db/models");
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../errors");
class UtilService {
    constructor() {
        this.StatisticsModel = models_1.Statistics;
    }
    updateStat(stat_type) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            let currentMonth = now.getMonth() + 1;
            let currentYear = now.getFullYear();
            let currentStat = yield this.StatisticsModel.findOrCreate({
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
            (_a = currentStat[0]) === null || _a === void 0 ? void 0 : _a.update({
                value: ((_c = (_b = currentStat[0]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 0) + 1,
            });
            return "success";
        });
    }
    decrementStat(stat_type) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            let currentMonth = now.getMonth() + 1;
            let currentYear = now.getFullYear();
            let currentStat = yield this.StatisticsModel.findOrCreate({
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
            (_a = currentStat[0]) === null || _a === void 0 ? void 0 : _a.update({
                value: ((_c = (_b = currentStat[0]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 0) === 0
                    ? 0
                    : ((_e = (_d = currentStat[0]) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : 0) - 1,
            });
            return "success";
        });
    }
    googleMapsAutoComplete(value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value.searchQuery}&key=AIzaSyAqoyaPtHf5BcoTX_iNvCzXjVj6BpGl2do`);
                // console.log(response.data.url);
                // console.log(response.data.explanation);
                return response.data;
            }
            catch (error) {
                console.log(error);
                throw new errors_1.NotFoundError("Failed to resolve query");
            }
        });
    }
    googleMapsLocationSearch(value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${value.searchQuery}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=AIzaSyAqoyaPtHf5BcoTX_iNvCzXjVj6BpGl2do`);
                // console.log(response.data.url);
                // console.log(response.data.explanation);
                return response.data;
            }
            catch (error) {
                console.log(error);
                throw new errors_1.NotFoundError("Failed to resolve query");
            }
        });
    }
}
exports.default = new UtilService();
//# sourceMappingURL=util.service.js.map