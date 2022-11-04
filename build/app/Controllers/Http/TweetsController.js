"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class TweetsController {
    async index({ inertia, params }) {
        const campaign = await Database_1.default.from("campaigns").where("id", params.id).first();
        const tweets = await Database_1.default.from("tweets").where("campaign_id", params.id).where("status", "on review");
        const pathname = "onreview-tweets";
        return inertia.render("tweets", { campaign, tweets, pathname });
    }
    async allTweet({ inertia, params }) {
        const campaign = await Database_1.default.from("campaigns").where("id", params.id).first();
        const tweets = await Database_1.default.from("tweets").where("campaign_id", params.id);
        const pathname = "all-tweets";
        return inertia.render("tweets", { campaign, tweets, pathname });
    }
    async create({}) { }
    async store({ request, response }) {
        const data = request.all();
        await Database_1.default.table("tweets").insert(data);
        if (data.published_by) {
            await Database_1.default.from("campaign_attendances").where("campaign_id", data.campaign_id).where("troop_id", data.published_by).increment({
                action_score: 5,
                tweet_submit_number: 1
            });
            await Database_1.default.from("troops").where("id", data.published_by).increment({
                score: 5
            });
        }
        return response.redirect().back();
    }
    async show({}) { }
    async edit({}) { }
    async update({ params, request }) {
        await Database_1.default.from("tweets").where("id", params.id).update(request.except(['id']));
    }
    async destroy({}) { }
}
exports.default = TweetsController;
//# sourceMappingURL=TweetsController.js.map