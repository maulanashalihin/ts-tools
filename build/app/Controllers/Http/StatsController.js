"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const dayjs_1 = __importDefault(require("dayjs"));
class StatsController {
    async index({ inertia }) {
        return inertia.render("omoo-stats");
    }
    async getData({ request }) {
        const from = (0, dayjs_1.default)(request.input("from", (0, dayjs_1.default)().subtract(1, 'month'))).add(1, 'day').valueOf().toString();
        const to = (0, dayjs_1.default)(request.input("to", (0, dayjs_1.default)())).add(1, 'day').valueOf().toString();
        const daily_open_rate = await Database_1.default.from("open_rates").whereBetween("date", [from, to]).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).count("* as total").groupBy("date_only");
        const daily_open_rate_unique = await Database_1.default.from("open_rates").whereBetween("date", [from, to]).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).countDistinct("troop_id as total").groupBy("date_only");
        const open_rate_per_city = await Database_1.default.from("open_rates").whereBetween("date", [from, to]).select("city").count("* as total").groupBy("city");
        const daily_share_rate = await Database_1.default.from("share_rates").whereBetween("date", [from, to]).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).count("* as total").groupBy("date_only");
        const daily_share_rate_unique = await Database_1.default.from("share_rates").whereBetween("date", [from, to]).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).countDistinct("troop_id as total").groupBy("date_only");
        const share_rate_per_city = await Database_1.default.from("share_rates").whereBetween("date", [from, to]).select("city").count("* as total").groupBy("city");
        return {
            daily_open_rate,
            daily_open_rate_unique,
            open_rate_per_city,
            daily_share_rate,
            daily_share_rate_unique,
            share_rate_per_city
        };
    }
    async getDataCity({ request }) {
        const from = (0, dayjs_1.default)(request.input("from", (0, dayjs_1.default)().subtract(1, 'month'))).add(1, 'day').valueOf().toString();
        const to = (0, dayjs_1.default)(request.input("to", (0, dayjs_1.default)())).add(1, 'day').valueOf().toString();
        const city = request.input("city", "Jakarta");
        const cityresult = (await Database_1.default.from("open_rates").whereBetween("date", [from, to]).whereILike("city", `%${city}%`).select("city").first()).city;
        const open_rate = await Database_1.default.from("open_rates").whereBetween("date", [from, to]).where("city", cityresult).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).count("* as total").groupBy("date_only");
        const open_rate_unique = await Database_1.default.from("open_rates").whereBetween("date", [from, to]).where("city", cityresult).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).countDistinct("troop_id as total").groupBy("date_only");
        const share_rate = await Database_1.default.from("share_rates").whereBetween("date", [from, to]).where("city", cityresult).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).count("* as total").groupBy("date_only");
        const share_rate_unique = await Database_1.default.from("share_rates").whereBetween("date", [from, to]).where("city", cityresult).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).countDistinct("troop_id as total").groupBy("date_only");
        return {
            cityresult,
            open_rate,
            open_rate_unique,
            share_rate,
            share_rate_unique
        };
    }
    async getCityName({}) {
        const city = await Database_1.default.from("open_rates").select("city");
        const cityresult = city.filter((item) => item.city !== null).map((item) => item.city).filter((value, index, self) => self.indexOf(value) === index);
        cityresult.forEach((item, index) => {
            cityresult[index] = {
                name: item,
            };
        });
        return {
            cityresult
        };
    }
    async show({}) { }
    async edit({}) { }
    async update({}) { }
    async destroy({}) { }
}
exports.default = StatsController;
//# sourceMappingURL=StatsController.js.map