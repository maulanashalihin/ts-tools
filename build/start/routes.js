"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('/login', async ({ inertia, auth, response }) => {
    const check = await auth.check();
    if (check) {
        return response.redirect("/home");
    }
    return inertia.render('login');
});
Route_1.default.post("/login", "AuthController.login");
Route_1.default.group(() => {
    Route_1.default.get("/home", "CampaignsController.index");
    Route_1.default.resource("/campaign", "CampaignsController");
    Route_1.default.resource("/strat-plan", "StratPlansController");
    Route_1.default.resource("/users", "UsersController");
    Route_1.default.resource("/riayah", "RiayahsController");
    Route_1.default.get("/campaign/:id/onreview-tweets", "TweetsController.index");
    Route_1.default.get("/campaign/:id/all-tweets", "TweetsController.allTweet");
    Route_1.default.get("/campaign/:id/tweet-buzz", "TweetBuzzesController.index");
    Route_1.default.get("/campaign/:id/media", "MediaController.index");
    Route_1.default.get("/campaign/:id/report", "CampaignsController.report");
    Route_1.default.get("/campaign/:id/troops", "CampaignsController.troops");
    Route_1.default.get("/only-tweets", "TweetsController.onlyTweets");
    Route_1.default.post("/tweets", "TweetsController.store");
    Route_1.default.put("/tweets/:id", "TweetsController.update");
    Route_1.default.post("/tweet-buzz", "TweetBuzzesController.store");
    Route_1.default.post("/media", "MediaController.store");
    Route_1.default.delete("/media/:id", "MediaController.destroy");
    Route_1.default.delete("/tweet-buzz/:id", "TweetBuzzesController.destroy");
    Route_1.default.get("/troops", "TroopsController.index");
    Route_1.default.put("/troops/:id", "TroopsController.update");
    Route_1.default.get("/download-troops", "TroopsController.download");
    Route_1.default.get("/messages", "MessagesController.index");
    Route_1.default.get("/omoo-channels", "ChannelsController.admins");
    Route_1.default.get("/omoo-channels/:id", "ChannelsController.adminView");
    Route_1.default.get("/omoo-contents", "ContentsController.index");
    Route_1.default.put("/omoo-contents/:id", "ContentsController.update");
    Route_1.default.put("/make-official-channel/:id", "ChannelsController.makeOfficial");
    Route_1.default.put("/messages/:id", "MessagesController.update");
    Route_1.default.post("/logout", "AuthController.logout");
    Route_1.default.post("/api-keys", "MessagesController.storeApiKey");
    Route_1.default.delete("/api-keys/:id", "MessagesController.deleteApiKey");
    Route_1.default.post("/test-api", "MessagesController.testApi");
}).middleware(['auth']);
Route_1.default.get("/ts-login", ({ inertia }) => {
    return inertia.render("ts-login");
});
Route_1.default.get("/troop-register", ({ inertia }) => {
    return inertia.render("ts-register-2");
});
Route_1.default.post("/ts-login", "TroopsController.login");
Route_1.default.post("/ts-register", "TroopsController.register");
Route_1.default.post("/ts-otp", "TroopsController.verifyOTP");
Route_1.default.group(() => {
    Route_1.default.get("/", "TroopsController.home");
    Route_1.default.get("/profile", "TroopsController.edit");
    Route_1.default.post("/profile", "TroopsController.profile");
    Route_1.default.get("/history", "TroopsController.history");
    Route_1.default.get("/leaderboard", "TroopsController.leaderboard");
    Route_1.default.post("/buzzer", "TroopsController.store");
    Route_1.default.post("/buzzer/tweet", "TweetsController.store");
    Route_1.default.get("/c/:id", "CampaignsController.show");
    Route_1.default.put("/attendance/:id", "CampaignsController.updateAttendance");
    Route_1.default.put("/score/:id", "CampaignsController.updateScore");
    Route_1.default.post("/buzzer/logout", "TroopsController.logout");
    Route_1.default.get("/omoo", "ChannelsController.index");
    Route_1.default.get("/channel/create", "ChannelsController.create");
    Route_1.default.post('/channel', "ChannelsController.store");
    Route_1.default.get("/channel/:id", "ChannelsController.show");
    Route_1.default.get("/channel/:id/edit", "ChannelsController.edit");
    Route_1.default.put("/channel/:id", "ChannelsController.update");
    Route_1.default.post("/channel/:id/members", "ChannelsController.members");
    Route_1.default.delete("/channel/:id/members", "ChannelsController.deleteMember");
    Route_1.default.resource("/channel/:channel_id/content", "ContentsController");
    Route_1.default.post('/upload', "UploadsController.store");
    Route_1.default.put("/start-campaign/:id", "CampaignsController.startCampaign");
    Route_1.default.put("/end-campaign/:id", "CampaignsController.endCampaign");
}).middleware(['buzzer']);
Route_1.default.post("/request-otp", "TroopsController.requestOTP");
Route_1.default.get("/api/article", "GuestArticlesController.index");
Route_1.default.post("/api/login", "OmooAuthsController.login");
Route_1.default.post("/api/check-otp", "OmooAuthsController.verifyOTP");
Route_1.default.get("/api/check", "OmooAuthsController.check");
Route_1.default.get("/api/quran", "GuestArticlesController.ayat");
Route_1.default.group(() => {
    Route_1.default.get("/contents/omoo", "ContentsController.omoo");
    Route_1.default.get("/contents/terkini", "ContentsController.latest");
    Route_1.default.get("/contents/trending", "ContentsController.trending");
    Route_1.default.get("/contents/official", "ContentsController.official");
    Route_1.default.put("/contents/:id", "ContentsController.update");
    Route_1.default.put("/contents/share/:id", "ContentsController.share");
    Route_1.default.put("/contents/like/:id", "ContentsController.like");
    Route_1.default.put("/contents/dislike/:id", "ContentsController.dislike");
    Route_1.default.post("/daily-tweet", "ContentsController.dailyTweet");
    Route_1.default.post("/logout", "OmooAuthsController.logout");
}).middleware(['api']).prefix("/api");
//# sourceMappingURL=routes.js.map