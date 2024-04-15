"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class MigrateDb extends standalone_1.BaseCommand {
    async run() {
        const headers = ["omoo_histories", "open_rates", "share_rates"];
        for await (const table of headers) {
            let latest_id = 0;
            let data_length = 1000;
            let total = await Database_1.default.connection("mysql").from(table).count("* as total").first();
            while (total && total.total > 0 && data_length == 1000) {
                let data;
                if (latest_id == 0) {
                    data = await Database_1.default.connection("mysql").from(table).limit(1000);
                }
                else {
                    data = await Database_1.default.connection("mysql").from(table).where("id", ">", latest_id).limit(1000);
                }
                data_length = data.length;
                console.log("migrating " + data_length + " " + table + " data");
                if (data.length) {
                    latest_id = data[data.length - 1].id;
                    console.log("latest_id " + latest_id);
                }
                for await (const row of data) {
                    await Database_1.default.table(table).insert(row);
                }
            }
            console.log("done migrate " + table + " table");
        }
    }
}
exports.default = MigrateDb;
MigrateDb.commandName = 'migrate:db';
MigrateDb.description = '';
MigrateDb.settings = {
    loadApp: true,
    stayAlive: false,
};
//# sourceMappingURL=MigrateDb.js.map