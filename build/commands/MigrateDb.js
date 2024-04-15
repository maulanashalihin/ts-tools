"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class MigrateDb extends standalone_1.BaseCommand {
    async run() {
        const headers = ["popup_contents"];
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