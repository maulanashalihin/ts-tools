"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'campaign_attendances';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer("campaign_id").index();
            table.string("campaign_title");
            table.bigInteger("campaign_time");
            table.integer("troop_id").index();
            table.string("troop_username");
            table.string("troop_phone");
            table.bigInteger("join_time");
            table.integer("round_number");
            table.integer("next_round_interval").defaultTo(60);
            table.integer("current_round").defaultTo(1);
            table.integer("tweet_submit_number").defaultTo(0);
            table.integer("tweet_published").defaultTo(0);
            table.integer("action_score").defaultTo(0);
            table.bigInteger("next_round_time").index();
            table.bigInteger("reminder_round_time").index();
            table.unique(["campaign_id", "troop_id"]);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1666763397933_campaign_attendances.js.map