"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const dayjs_1 = __importDefault(require("dayjs"));
class StatsController {
    async index({ inertia }) {
        const daily_open_rate = await Database_1.default.from("open_rates").where("date", ">=", (0, dayjs_1.default)().subtract(1, 'month').valueOf().toString()).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).count("* as total").groupBy("date_only");
        const daily_open_rate_unique = await Database_1.default.from("open_rates").where("date", ">=", (0, dayjs_1.default)().subtract(1, 'month').valueOf().toString()).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).countDistinct("troop_id as total").groupBy("date_only");
        const open_rate_per_city = await Database_1.default.from("open_rates").where("date", ">=", (0, dayjs_1.default)().subtract(1, 'month').valueOf().toString()).select("city").count("* as total").groupBy("city");
        const daily_share_rate = await Database_1.default.from("share_rates").where("date", ">=", (0, dayjs_1.default)().subtract(1, 'month').valueOf().toString()).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).count("* as total").groupBy("date_only");
        const daily_share_rate_unique = await Database_1.default.from("share_rates").where("date", ">=", (0, dayjs_1.default)().subtract(1, 'month').valueOf().toString()).select(Database_1.default.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).countDistinct("troop_id as total").groupBy("date_only");
        const share_rate_per_city = await Database_1.default.from("share_rates").where("date", ">=", (0, dayjs_1.default)().subtract(1, 'month').valueOf().toString()).select("city").count("* as total").groupBy("city");
        return inertia.render("omoo-stats", {
            daily_open_rate,
            daily_open_rate_unique,
            open_rate_per_city,
            daily_share_rate,
            daily_share_rate_unique,
            share_rate_per_city
        });
    }
    async create({}) { }
    async store({}) { }
    async show({}) { }
    async edit({}) { }
    async update({}) { }
    async destroy({}) { }
}
exports.default = StatsController;
//# sourceMappingURL=StatsController.js.map