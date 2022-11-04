"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const axios_1 = __importDefault(require("axios"));
class MediaController {
    async index({ inertia, params }) {
        const campaign = await Database_1.default.from("campaigns").where("id", params.id).first();
        const medias = await Database_1.default.from("medias").where("campaign_id", params.id);
        return inertia.render('tweet-media', { medias, campaign });
    }
    async create({}) { }
    async store({ request }) {
        const response = await axios_1.default.get("https://api.twitter.com/1.1/statuses/show.json", { params: { id: request.input("tweet_id"), tweet_mode: "extended", include_entities: true }, headers: { Authorization: `Bearer AAAAAAAAAAAAAAAAAAAAAFnn5wAAAAAAkH1VAEbMWYhL3ELPVJUAcMlaIxw%3DdPXyF9cPxPURaYSxHZnzWaRaiiUhW38McownVmjGyc8Id3eW0K` } });
        if (response.data) {
            if (response.data.extended_entities)
                if (response.data.extended_entities.media.length) {
                    let data = request.all();
                    data.media_url = response.data.extended_entities.media[0].media_url_https;
                    data.twitter_url = response.data.extended_entities.media[0].url;
                    data.type = response.data.extended_entities.media[0].type;
                    data.id = await Database_1.default.table("medias").insert(data);
                    return data;
                }
        }
    }
    async show({}) { }
    async edit({}) { }
    async update({}) { }
    async destroy({ params }) {
        await Database_1.default.from("medias").where("id", params.id).delete();
    }
}
exports.default = MediaController;
//# sourceMappingURL=MediaController.js.map