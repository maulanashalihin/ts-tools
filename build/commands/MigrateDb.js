"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class MigrateDb extends standalone_1.BaseCommand {
    async run() {
        const headers = ["users", "campaigns", "troops", "tweets", "medias", "tweet_to_buzzes", "campaign_attendances", "api_keys", "messages", "riayahs", "channels", "contents", "channel_admins", "api_tokens", "bank_tsaqofahs", "strat_plans", "request_unblocks", "open_rates", "share_rates", "search_rates", "popup_contents"];
        for await (const table of headers) {
            const data = await Database_1.default.connection("mysql").from(table);
            for await (const row of data) {
                await Database_1.default.table(table).insert(row);
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