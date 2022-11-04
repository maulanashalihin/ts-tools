"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const axios_1 = __importDefault(require("axios"));
class ReminderRound extends standalone_1.BaseCommand {
    async run() {
        this.logger.info('Hello world!');
        const campaign = await Database_1.default.from("campaigns").orderBy("id", 'desc').first();
        if (campaign) {
            const attendances = await Database_1.default.from("campaign_attendances").where("campaign_id", campaign.id).where("next_round_time", '<', Date.now());
            for await (const attendee of attendances) {
                const api_key = await Database_1.default.from("api_keys").orderBy(Database_1.default.raw('RAND()')).first();
                if (api_key && process.env.NODE_ENV != 'development') {
                    const message = await Database_1.default.from("messages").where("id", "join").first();
                    let text = message.text.split('[current_round]').join((attendee.current_round + 1));
                    axios_1.default.post("http://api.dripsender.id/send", {
                        api_key: api_key.id,
                        phone: attendee.phone,
                        text: text,
                        buttons: JSON.parse(message.buttons)
                    });
                }
            }
        }
    }
}
exports.default = ReminderRound;
ReminderRound.commandName = 'reminder:round';
ReminderRound.description = '';
ReminderRound.settings = {
    loadApp: true,
    stayAlive: false,
};
//# sourceMappingURL=ReminderRound.js.map