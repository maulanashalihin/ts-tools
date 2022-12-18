"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class ChannelsController {
    async index({ inertia, auth }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const channel_id = await Database_1.default.from("channel_admins").where("troop_id", user.id).select(['channel_id']);
            const channels = await Database_1.default.from("channels").whereIn("id", channel_id.map(item => item.channel_id));
            return inertia.render("omoo-channels", { channels });
        }
    }
    async admins({ inertia, auth }) {
        const user = auth.use("web").user;
        if (user) {
            const channels = await Database_1.default.from("channels");
            return inertia.render("omoo-channels-admins", { channels });
        }
    }
    async create({ inertia }) {
        return inertia.render("omoo-channel-create");
    }
    async store({ request, response, auth }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const channel_id = await Database_1.default.table("channels").insert({
                name: request.input("name"),
                avatar: request.input("avatar")
            });
            await Database_1.default.table("channel_admins").insert({
                troop_id: user.id,
                channel_id
            });
            return response.redirect("/channel/" + channel_id);
        }
    }
    async show({ params, inertia, auth }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const check = await Database_1.default.from("channel_admins").where("troop_id", user.id).where("channel_id", params.id).first();
            if (check) {
                const channel = await Database_1.default.from("channels").where("id", params.id).first();
                const contents = await Database_1.default.from("contents").where("channel_id", params.id);
                return inertia.render("omoo-contents", { contents, channel });
            }
        }
    }
    async edit({ params, inertia }) {
        const channel = await Database_1.default.from("channels").where("id", params.id).first();
        return inertia.render("omoo-channel-create", { channel });
    }
    async update({ auth, request, response, params }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const channel_id = await Database_1.default.from("channels").where("id", params.id).update(request.except(['id']));
            return response.redirect("/channel/" + channel_id);
        }
    }
    async makeOfficial({ auth, request, params }) {
        const user = auth.use("web").user;
        if (user) {
            await Database_1.default.from("channels").where("id", params.id).update(request.except(['id']));
        }
    }
    async destroy({}) { }
}
exports.default = ChannelsController;
//# sourceMappingURL=ChannelsController.js.map