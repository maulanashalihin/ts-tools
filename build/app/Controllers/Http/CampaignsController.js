"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const dayjs_1 = __importDefault(require("dayjs"));
class CampaignsController {
    async index({ inertia }) {
        const campaigns = await Database_1.default.from("campaigns").orderBy("id", "desc").limit(16);
        for await (const campaign of campaigns) {
            if (campaign.status == 'tweet submission') {
                campaign.tweets = await Database_1.default.from("tweets").where("campaign_id", campaign.id).count("* as total").first();
            }
        }
        return inertia.render("home", { campaigns });
    }
    async create({ inertia }) {
        return inertia.render("campaign-create");
    }
    async report({ inertia, params }) {
        const campaign = await Database_1.default.from("campaigns").where("id", params.id).first();
        const total_tweet = await Database_1.default.from("campaign_attendances").where("campaign_id", params.id).sum("tweet_published as total").first();
        const tweet_submit = await Database_1.default.from("tweets").where("campaign_id", params.id).count("* as total").first();
        const tpm_stat = await Redis_1.default.hgetall("tweet-speed:" + params.id);
        const tpm_max_array = Object.values(tpm_stat);
        const tpm_max = Math.max.apply(Math, tpm_max_array);
        return inertia.render("campaign-report", { campaign, total_tweet, tweet_submit, tpm_stat, tpm_max });
    }
    async startCampaign({ params }) {
        await Database_1.default.from("campaigns").where("id", params.id).update({ status: "running" });
        return "OK";
    }
    async endCampaign({ params }) {
        await Database_1.default.from("campaigns").where("id", params.id).update({ status: "done" });
        return "OK";
    }
    async troops({ inertia, params }) {
        const campaign = await Database_1.default.from("campaigns").where("id", params.id).first();
        const troops = await Database_1.default.from("campaign_attendances").where("campaign_id", campaign.id).orderBy("action_score", "desc");
        return inertia.render("campaign-troops", { campaign, troops });
    }
    async store({ request, response }) {
        let data = request.all();
        await Database_1.default.table("campaigns").insert(data);
        return response.redirect("/home");
    }
    async show({ params, inertia, auth }) {
        const user = await auth.use("buzzer").user;
        if (!user) {
            return;
        }
        const campaign = await Database_1.default.from("campaigns").where("id", params.id).first();
        let attendance = await Database_1.default.from("campaign_attendances").where("campaign_id", campaign.id).where("troop_id", user.id).first();
        if (!attendance) {
            attendance =
                {
                    campaign_id: campaign.id,
                    campaign_title: campaign.title,
                    campaign_time: campaign.time,
                    troop_id: user.id,
                    troop_username: user.twitter_username,
                    troop_tg_id: user.tg_id,
                    next_round_interval: 60
                };
            attendance.id = await Database_1.default.table("campaign_attendances").insert(attendance);
            await Database_1.default.from("campaigns").where("id", params.id).increment({
                attendee: 1
            });
            await Database_1.default.from("troops").where("id", user.id).update({ last_active: Date.now() });
            const message = await Database_1.default.from("messages").where("id", "join").first();
            let text = message.text.split('[title]').join(campaign.title);
            text = text.split('[time]').join((0, dayjs_1.default)(campaign.time).subtract(1, 'h').format("DD-MM-YYYY HH:mm") + " WIB");
            const data = {
                tg_id: user.tg_id,
                text: text
            };
            await Redis_1.default.sadd("queue:riayah", JSON.stringify(data));
        }
        if (campaign.status == 'tweet submission') {
            const tweets = await Database_1.default.from("tweets").where("published_by", user.id);
            return inertia.render("ts-submit-tweet", { campaign, tweets, attendance });
        }
        if (campaign.status == 'running') {
            const tweets = await Database_1.default.from("tweets").where("campaign_id", campaign.id).where("status", "published").limit(campaign.tweet_per_round).orderBy(Database_1.default.raw('RAND()'));
            const buzzes = await Database_1.default.from("tweet_to_buzzes").where("campaign_id", campaign.id).limit(campaign.tweet_love_and_retweet_per_round).orderBy(Database_1.default.raw('RAND()'));
            const replies = await Database_1.default.from("tweet_to_buzzes").where("campaign_id", campaign.id).limit(campaign.tweet_reply_per_round).orderBy(Database_1.default.raw('RAND()'));
            const medias = await Database_1.default.from("medias").where("campaign_id", campaign.id);
            const profiles = await Database_1.default.from("campaign_attendances").where("campaign_id", campaign.id).select(['troop_username']).limit(campaign.follow_profile_per_round).orderBy(Database_1.default.raw('RAND()'));
            return inertia.render("ts-running-campaign", { campaign, tweets, attendance, buzzes, replies, medias, profiles });
        }
    }
    async edit({ params, inertia }) {
        const campaign = await Database_1.default.from("campaigns").where("id", params.id).first();
        return inertia.render("campaign-create", { campaign });
    }
    async update({ request, response, params }) {
        let data = request.except(['id']);
        await Database_1.default.from("campaigns").where("id", params.id).update(data);
        return response.redirect("/home", false, 303);
    }
    async updateAttendance({ request, params }) {
        let data = request.except(['id']);
        await Database_1.default.from("campaign_attendances").where("id", params.id).update(data);
        return "OK";
    }
    async updateScore({ params, auth, request }) {
        if (request.input("is_tweet")) {
            await Database_1.default.from("campaign_attendances").where("id", params.id).increment({
                action_score: 1,
                tweet_published: 1
            });
            const time = (0, dayjs_1.default)().format("YYYY-MM-DDTHH:mm");
            const incrTime = await Redis_1.default.incr("speed" + time);
            await Redis_1.default.hset("tweet-speed:" + request.input("campaign_id"), time, incrTime);
        }
        else {
            await Database_1.default.from("campaign_attendances").where("id", params.id).increment({
                action_score: 1,
            });
        }
        const user = await auth.use("buzzer").user;
        if (user)
            await Database_1.default.from("troops").where("id", user.id).increment({
                score: 1
            });
        return "OK";
    }
    async destroy({ params, response }) {
        await Database_1.default.from("campaigns").where("id", params.id).delete();
        await Database_1.default.from("tweets").where("campaign_id", params.id).delete();
        await Database_1.default.from("tweet_to_buzzes").where("campaign_id", params.id).delete();
        await Database_1.default.from("medias").where("campaign_id", params.id).delete();
        await Database_1.default.from("campaign_attendances").where("campaign_id", params.id).delete();
        return response.redirect("/home", false, 303);
    }
}
exports.default = CampaignsController;
//# sourceMappingURL=CampaignsController.js.map