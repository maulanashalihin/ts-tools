"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'campaigns';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string("title");
            table.text("description");
            table.string("status").defaultTo("tweet submission");
            table.string("hashtags");
            table.integer("hashtag_per_tweet").defaultTo(1);
            table.bigInteger("time");
            table.string("campaign_time");
            table.string("slug").unique();
            table.integer("attendee").defaultTo(0);
            table.integer("follow_profile_per_round").defaultTo(5);
            table.integer("tweet_per_round").defaultTo(5);
            table.integer("tweet_love_and_retweet_per_round").defaultTo(5);
            table.integer("tweet_reply_per_round").defaultTo(5);
            table.text("report");
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1666759428791_campaigns.js.map