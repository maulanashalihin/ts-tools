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
    Route_1.default.resource("/users", "UsersController");
    Route_1.default.resource("/riayah", "RiayahsController");
    Route_1.default.get("/campaign/:id/onreview-tweets", "TweetsController.index");
    Route_1.default.get("/campaign/:id/all-tweets", "TweetsController.allTweet");
    Route_1.default.get("/campaign/:id/tweet-buzz", "TweetBuzzesController.index");
    Route_1.default.get("/campaign/:id/media", "MediaController.index");
    Route_1.default.get("/campaign/:id/report", "CampaignsController.report");
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
    Route_1.default.put("/messages/:id", "MessagesController.update");
    Route_1.default.post("/logout", "AuthController.logout");
    Route_1.default.post("/api-keys", "MessagesController.storeApiKey");
    Route_1.default.delete("/api-keys/:id", "MessagesController.deleteApiKey");
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
}).middleware(['buzzer']);
Route_1.default.post("/request-otp", "TroopsController.requestOTP");
//# sourceMappingURL=routes.js.map