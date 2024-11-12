"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class TweetsController {
    async index({ inertia, params }) {
        const campaign = await Database_1.default.from("campaigns").where("id", params.id).first();
        let incr = await Redis_1.default.get("incr:" + campaign.id);
        if (incr) {
            await Redis_1.default.incr("incr:" + campaign.id);
        }
        else {
            incr = 0;
            await Redis_1.default.setex("incr:" + campaign.id, 60 * 5, 1);
        }
        const tweets = await Database_1.default.from("tweets").where("campaign_id", params.id).where("status", "on review").offset(25 * incr).limit(25);
        if (tweets.length < 25) {
            await Redis_1.default.del("incr:" + campaign.id);
        }
        const counts = await Database_1.default.from("tweets").where("campaign_id", params.id).where("status", "on review").count("* as total").first();
        const pathname = "onreview-tweets";
        return inertia.render("tweets", { campaign, tweets, pathname, counts: counts.total });
    }
    async allTweet({ inertia, params }) {
        const campaign = await Database_1.default.from("campaigns").where("id", params.id).first();
        const tweets = await Database_1.default.from("tweets").where("campaign_id", params.id).limit(25);
        const pathname = "all-tweets";
        const counts = await Database_1.default.from("tweets").where("campaign_id", params.id).count("* as total").groupBy('status').distinct('status');
        console.log(counts);
        return inertia.render("tweets", { campaign, tweets, pathname, counts });
    }
    async onlyTweets({ request }) {
        const page = request.input("page", 0);
        const tweets = await Database_1.default.from("tweets").where("campaign_id", request.input("campaign_id")).offset(25 * page).limit(25);
        return tweets;
    }
    async create({}) { }
    async store({ request, response }) {
        const data = request.all();
        await Database_1.default.table("tweets").insert(data);
        if (data.published_by) {
            await Database_1.default.from("campaign_attendances").where("campaign_id", data.campaign_id).where("troop_id", data.published_by).increment({
                action_score: 3,
                tweet_submit_number: 1
            });
            await Database_1.default.from("troops").where("id", data.published_by).increment({
                score: 3
            });
        }
        return response.redirect().back();
    }
    async show({}) { }
    async edit({}) { }
    async update({ params, request }) {
        await Database_1.default.from("tweets").where("id", params.id).update(request.except(['id']));
        if (request.input('status') == 'published') {
            await Database_1.default.from("campaign_attendances").where("campaign_id", request.input('campaign_id')).where("troop_id", request.input('published_by')).increment({
                action_score: 3
            });
            await Database_1.default.from("troops").where("id", request.input('published_by')).increment({
                score: 3
            });
        }
        if (request.input('status') == 'rejected') {
            await Database_1.default.from("campaign_attendances").where("campaign_id", request.input('campaign_id')).where("troop_id", request.input('published_by')).decrement({
                action_score: 3
            });
            await Database_1.default.from("troops").where("id", request.input('published_by')).decrement({
                score: 3
            });
        }
    }
    async destroy({}) { }
}
exports.default = TweetsController;
//# sourceMappingURL=TweetsController.js.map