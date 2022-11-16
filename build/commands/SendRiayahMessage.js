"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const axios_1 = __importDefault(require("axios"));
class SendRiayahMessage extends standalone_1.BaseCommand {
    async run() {
        this.logger.info('Hello world!');
        const campaign = await Database_1.default.from("riayahs").where("status", "sending").first();
        const api_keys = await Database_1.default.from("api_keys");
        if (campaign) {
            if (campaign.last_troop_id) {
                let troops;
                if (campaign.troop_id) {
                    troops = await Database_1.default.from("troops").where("id", ">=", campaign.troop_id).limit(api_keys.length * 6);
                }
                else {
                    troops = await Database_1.default.from("troops").limit(api_keys.length * 6);
                }
                if (troops.length <= 1) {
                    await Database_1.default.from("riayahs").where("id", campaign.id).update({ status: "done" });
                    return;
                }
                let api_id = 0;
                for await (const troop of troops) {
                    await axios_1.default.post("http://api.dripsender.id/send", {
                        api_key: api_keys[api_id].id,
                        phone: troop.phone,
                        text: campaign.text,
                        type: "buttonsMessage",
                        footerText: "Admin TS",
                        buttons: campaign.buttons.split(',')
                    });
                    api_id++;
                    if (api_id == api_keys.length) {
                        api_id = 0;
                    }
                }
                await Database_1.default.from("riayahs").where("id", campaign.id).update({ troop_id: troops[troops.length - 1].id });
            }
            else {
                const troop = await Database_1.default.from("troops").orderBy("id", "desc").first();
                if (troop)
                    campaign.last_troop_id = troop.id;
            }
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