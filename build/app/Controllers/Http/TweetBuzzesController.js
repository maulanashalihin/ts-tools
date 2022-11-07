"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const axios_1 = __importDefault(require("axios"));
class TweetBuzzesController {
    async index({ inertia, params }) {
        const campaign = await Database_1.default.from("campaigns").where("id", params.id).first();
        const buzzes = await Database_1.default.from("tweet_to_buzzes").where("campaign_id", params.id).orderBy("id", "desc");
        return inertia.render('tweet-buzz', { buzzes, campaign });
    }
    async create({}) { }
    async store({ request }) {
        const response = await axios_1.default.get("https://api.twitter.com/1.1/statuses/show.json", { params: { id: request.input("tweet_id"), tweet_mode: "extended" }, headers: { Authorization: `Bearer AAAAAAAAAAAAAAAAAAAAAFnn5wAAAAAAkH1VAEbMWYhL3ELPVJUAcMlaIxw%3DdPXyF9cPxPURaYSxHZnzWaRaiiUhW38McownVmjGyc8Id3eW0K` } });
        if (response.data) {
            let data = request.all();
            data.text = response.data.full_text;
            data.screen_name = response.data.user.screen_name;
            data.name = response.data.user.name;
            data.click_number = 0;
            data.id = await Database_1.default.table("tweet_to_buzzes").insert(data);
            return data;
        }
    }
    async show({}) { }
    async edit({}) { }
    async update({}) { }
    async destroy({ params }) {
        await Database_1.default.from("tweet_to_buzzes").where("id", params.id).delete();
    }
}
exports.default = TweetBuzzesController;
//# sourceMappingURL=TweetBuzzesController.js.map