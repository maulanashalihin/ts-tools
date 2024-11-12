"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const uuid_1 = require("uuid");
class GenerateToken extends standalone_1.BaseCommand {
    async run() {
        const ott = (0, uuid_1.v4)();
        let troop = await Database_1.default.from("troops").first();
        if (!troop) {
            troop = {
                tg_id: "796509100",
                name: "Maulana Shalihin"
            };
            try {
                troop.id = await Database_1.default.table("troops").insert(troop);
            }
            catch (error) {
            }
        }
        console.log(troop);
        await Redis_1.default.setex(`token:` + ott, 600, troop.id);
        console.log(ott);
    }
}
exports.default = GenerateToken;
GenerateToken.commandName = 'generate:token';
GenerateToken.description = '';
GenerateToken.settings = {
    loadApp: true,
    stayAlive: false,
};
//# sourceMappingURL=GenerateToken.js.map