"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class SendRiayahMessage extends standalone_1.BaseCommand {
    async run() {
        const campaign = await Database_1.default.from("riayahs").where("status", "sending").first();
        if (campaign) {
            let troops;
            if (campaign.troop_id) {
                troops = await Database_1.default.from("troops").where("id", ">", campaign.troop_id).whereNotNull('last_active').limit(600);
            }
            else {
                troops = await Database_1.default.from("troops").whereNotNull('last_active').limit(600);
            }
            if (troops.length == 0) {
                await Database_1.default.from("riayahs").where("id", campaign.id).update({ status: "done" });
                return;
            }
            for await (const troop of troops) {
                const data = {
                    tg_id: troop.tg_id,
                    text: campaign.text,
                    file: campaign.file
                };
                await Redis_1.default.sadd("queue:riayah", JSON.stringify(data));
            }
            this.logger.info("Send Message to " + troops.length + " troops");
            await Database_1.default.from("riayahs").where("id", campaign.id).update({ troop_id: troops[troops.length - 1].id });
        }
    }
}
exports.default = SendRiayahMessage;
SendRiayahMessage.commandName = 'send:riayah_message';
SendRiayahMessage.description = '';
SendRiayahMessage.settings = {
    loadApp: true,
    stayAlive: false,
};
//# sourceMappingURL=SendRiayahMessage.js.map