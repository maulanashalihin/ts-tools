"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
class default_1 extends Seeder_1.default {
    async run() {
        await Database_1.default.table("messages").insert({
            id: "join",
            text: `
Alhamdulillah, anda telah bergabung dalam campaign [title]

Campaign akan mulai pada [time]

Semoga Allah SWT membalas amal dan kebaikan kita. Trending Yuk! Gasken!
      `
        });
        await Database_1.default.table("messages").insert({
            id: "next_round_reminder",
            text: `
Saat ini round [current_round] telah dimulai

Yuk kembali masuk aplikasi dan melakukan ACTION yang sudah diakadkan.
`
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=MessageSeeder.js.map