"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'contents';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.text("caption");
            table.integer("channel_id").index();
            table.boolean("is_omoo").defaultTo(false).index();
            table.string("channel_name");
            table.string("channel_avatar");
            table.string("category").index();
            table.text("thumbnail");
            table.string("type");
            table.text("images_url");
            table.text("video_url");
            table.integer("likes").defaultTo(0);
            table.integer("share").defaultTo(0);
            table.integer("point").defaultTo(0).index();
            table.string("status").defaultTo("pending").index();
            table.bigInteger("created").index();
            table.string("publish_date").index();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1671073188691_contents.js.map