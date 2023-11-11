"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const dayjs_1 = __importDefault(require("dayjs"));
class ContentsController {
    async index({ inertia, auth }) {
        const user = auth.use("web").user;
        if (user) {
            const contents = await Database_1.default.from("contents").orderBy("id", "desc").limit(50);
            return inertia.render("omoo-contents-admins", { contents });
        }
    }
    async create({ inertia, params, auth }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const check = await Database_1.default.from("channel_admins").where("troop_id", user.id).where("channel_id", params.channel_id).first();
            if (check) {
                const strat = await Database_1.default.from("strat_plans").orderBy("id", "desc").first();
                const channel = await Database_1.default.from("channels").where("id", params.channel_id).first();
                return inertia.render("omoo-content-create", { channel, strat });
            }
        }
    }
    async store({ request, params, response }) {
        await Database_1.default.table("contents").insert(request.all());
        return response.redirect("/channel/" + params.channel_id);
    }
    async show({}) {
    }
    async customshow({ auth, params }) {
        const user = auth.use("web").user;
        if (user) {
            const pub = decodeURIComponent(params.pub);
            if (params.pub == "semua") {
                if (params.status != "semua") {
                    if (params.status == 'pending') {
                        const contents = await Database_1.default.from("contents").orderBy("id", "asc").where("status", params.status).limit(50);
                        return contents;
                    }
                    const contents = await Database_1.default.from("contents").orderBy("id", "desc").where("status", params.status).limit(50);
                    return contents;
                }
                const contents = await Database_1.default.from("contents").orderBy("id", "desc").limit(50);
                return contents;
            }
            if (params.status != "semua") {
                if (params.status == 'pending') {
                    const contents = await Database_1.default.from("contents").orderBy("id", "asc").where("channel_name", pub).where("status", params.status).limit(50);
                    return contents;
                }
                const contents = await Database_1.default.from("contents").orderBy("id", "desc").where("channel_name", pub).where("status", params.status).limit(50);
                return contents;
            }
            const contents = await Database_1.default.from("contents").orderBy("id", "desc").where("channel_name", pub).limit(50);
            return contents;
        }
    }
    async edit({ inertia, params, auth }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const check = await Database_1.default.from("channel_admins").where("troop_id", user.id).where("channel_id", params.channel_id).first();
            if (check) {
                const channel = await Database_1.default.from("channels").where("id", params.channel_id).first();
                const content = await Database_1.default.from("contents").where("id", params.id).first();
                return inertia.render("omoo-content-create", { channel, content });
            }
        }
    }
    async update({ request, params }) {
        await Database_1.default.from("contents").where('id', params.id).update(request.except(['id']));
    }
    async status({ request, params }) {
        await Database_1.default.from("contents").where('id', params.id).update({
            status: request.input("status"),
            is_omoo: request.input("is_omoo"),
            publish_date: Date.now().toString()
        });
    }
    async like({ params }) {
        await Database_1.default.from("contents").where('id', params.id).increment({ likes: 1, point: 1 });
        return "OK";
    }
    async dislike({ params }) {
        await Database_1.default.from("contents").where('id', params.id).decrement({ likes: 1, point: 1 });
        return "OK";
    }
    async share({ request, params, auth }) {
        const user = auth.use("api").user;
        if (user) {
            await Database_1.default.from("contents").where('id', params.id).increment({ share: 1, point: 1 });
            await Database_1.default.from("troops").where("id", user.id).increment({ score: 1 });
            await Database_1.default.table("share_rates").insert({
                city: user.city,
                date: Date.now(),
                troop_id: user.id
            });
            await Database_1.default.table("omoo_histories").insert({
                troop_id: user.id,
                notes: `${user.name} share konten omoo dari ${request.input("channel_name")}`,
                content_id: params.id,
                content_type: 'omoo',
                created: Date.now()
            });
        }
    }
    async dailyTweet({ auth }) {
        const user = auth.use("api").user;
        if (user) {
            await Database_1.default.from("troops").where("id", user.id).increment({ score: 10 });
            await Database_1.default.table("omoo_histories").insert({
                troop_id: user.id,
                notes: `${user.name} telah menyelesaikan daily tweet pada tanggal ${(0, dayjs_1.default)().format("DD-MM-YYYY")}`,
                content_type: 'daily-tweet',
                created: Date.now()
            });
        }
    }
    async destroy({ params }) {
        await Database_1.default.from("contents").where('id', params.id).delete();
    }
    async publist({}) {
        const contents = await Database_1.default.from("contents").select("channel_name");
        const channel = contents.filter((item) => item.channel_name !== null).map((item) => item.channel_name).filter((value, index, self) => self.indexOf(value) === index);
        channel.forEach((item, index) => {
            channel[index] = {
                name: item,
            };
        });
        return channel;
    }
    async omoo({ request }) {
        const pubname = request.input("publisher", "");
        if (pubname !== "") {
            const contents = await Database_1.default.from("contents").where("status", "approved").where("is_omoo", true).where("channel_name", pubname).orderBy("id", "desc").limit(100);
            return contents;
        }
        const contents = await Database_1.default.from("contents").where("status", "approved").where("is_omoo", true).orderBy("id", "desc").limit(100);
        return contents;
    }
    async latest({ request }) {
        const pubname = request.input("publisher", "");
        if (pubname !== "") {
            const contents = await Database_1.default.from("contents").where("status", "approved").where("channel_name", pubname).orderBy("publish_date", "desc").limit(100);
            return contents;
        }
        const contents = await Database_1.default.from("contents").where("status", "approved").orderBy("publish_date", "desc").limit(100);
        return contents;
    }
    async trending({ request }) {
        const pubname = request.input("publisher", "");
        if (pubname !== "") {
            const contents = await Database_1.default.from("contents").where("status", "approved").where("created", ">", (0, dayjs_1.default)().subtract(7, 'day').valueOf()).where("channel_name", pubname).orderBy("point", "desc").limit(100);
            return contents;
        }
        const contents = await Database_1.default.from("contents").where("status", "approved").where("created", ">", (0, dayjs_1.default)().subtract(7, 'day').valueOf()).orderBy("point", "desc").limit(100);
        return contents;
    }
    async official({ request }) {
        const pubname = request.input("publisher", "");
        if (pubname !== "") {
            const contents = await Database_1.default.from("contents").where("status", "approved").where("category", "Official").where("channel_name", pubname).orderBy("id", "desc").limit(100);
            return contents;
        }
        const contents = await Database_1.default.from("contents").where("status", "approved").where("category", "Official").orderBy("id", "desc").limit(100);
        return contents;
    }
}
exports.default = ContentsController;
//# sourceMappingURL=ContentsController.js.map