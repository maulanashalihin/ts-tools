/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/login', async ({ inertia,auth,response }) => {
  const check = await auth.check();
  if(check)
  {
    return response.redirect("/home")
  }
  return inertia.render('login')
})



 Route.post("/login","AuthController.login")

 
 

  Route.group(()=>{

    Route.get("/home","CampaignsController.index")

    Route.resource("/campaign","CampaignsController")

    Route.resource("/strat-plan","StratPlansController")

    Route.resource("/users","UsersController")

    Route.resource("/riayah","RiayahsController")

    Route.get("/campaign/:id/onreview-tweets","TweetsController.index")

    Route.get("/campaign/:id/all-tweets","TweetsController.allTweet")

    Route.get("/campaign/:id/tweet-buzz","TweetBuzzesController.index")

    Route.get("/campaign/:id/media","MediaController.index")

    Route.get("/campaign/:id/report","CampaignsController.report")

    Route.get("/campaign/:id/troops","CampaignsController.troops")
 

    
    Route.get("/only-tweets","TweetsController.onlyTweets")

    Route.post("/tweets","TweetsController.store")

    Route.put("/tweets/:id","TweetsController.update")

    Route.post("/tweet-buzz","TweetBuzzesController.store")

    Route.post("/media","MediaController.store")

    Route.delete("/media/:id","MediaController.destroy")

    Route.delete("/tweet-buzz/:id","TweetBuzzesController.destroy")

    Route.get("/troops","TroopsController.index")

    Route.post("/troops/unblock","TroopsController.unblock")

    Route.put("/troops/:id","TroopsController.update")

    Route.get("/download-troops","TroopsController.download")

    Route.get("/messages","MessagesController.index")

    Route.get("/omoo-stats","StatsController.index")

    Route.get("/omoo-stats/data","StatsController.getData")

    Route.get("/omoo-stats/datacity","StatsController.getDataCity")

    Route.get("/omoo-stats/cityname","StatsController.getCityName")

    Route.get("/omoo-stats/adminlist","StatsController.getAllChannelsWithAdmins")

    Route.get("/omoo-stats/trending","StatsController.getTrendingKonten")

    Route.get("/omoo-channels","ChannelsController.admins")

    Route.get("/omoo-channels/:id","ChannelsController.adminView")

    Route.get("/omoo-contents","ContentsController.index")

    Route.get("/omoo-contents/publist","ContentsController.publist")

    Route.get("/omoo-contents/popup/:pub","ContentsController.popupshow")

    Route.get("/omoo-contents/:status/pub/:pub","ContentsController.customshow")

    Route.put("/omoo-contents/:id","ContentsController.update") 

    Route.put("/omoo-contents/:id/popup","ContentsController.popup") 

    Route.put("/omoo-contents/:id/status","ContentsController.status") 

    Route.put("/make-official-channel/:id","ChannelsController.makeOfficial")

    Route.put("/messages/:id","MessagesController.update")

    Route.post("/logout","AuthController.logout")

    Route.post("/api-keys","MessagesController.storeApiKey")

    Route.delete("/api-keys/:id","MessagesController.deleteApiKey")

    Route.post("/test-api","MessagesController.testApi")

    Route.get("/bank-tsaqofah/admin","BankTsaqofahsController.indexAdmin")

    Route.get("/bank-tsaqofah/:id/review","BankTsaqofahsController.show")

    Route.post("/admin/channel/:id/members","ChannelsController.members")


    Route.get("/unblocks","UnblocksController.index")
    Route.put("/unblocks/:id","UnblocksController.update")

    Route.post('/riayah/upload', "RiayahsController.upload")

   Route.put("/bank-tsaqofah/:id/status","BankTsaqofahsController.status")

  }).middleware(['auth'])

  Route.get("/ts-login",({inertia})=>{
    return inertia.render("ts-login")
  })

  Route.get("/request-unblock","UnblocksController.create")
  Route.get("/request-unblock-success","UnblocksController.show")
  Route.post("/request-unblock","UnblocksController.store")
  
  
  Route.post("/ts-login","TroopsController.login")

  Route.post("/ts-register","TroopsController.register")

  Route.post("/ts-otp","TroopsController.verifyOTP")

  Route.post("/ts-verify-token","TroopsController.verifyToken")
  

  Route.group(()=>{

    Route.get("/","TroopsController.home")

    Route.get("/pin","TroopsController.pin")

    Route.post("/pin","TroopsController.setPin")

    Route.get("/profile","TroopsController.edit")

    Route.post("/profile","TroopsController.profile")

    Route.get("/history","TroopsController.history")

    Route.get("/leaderboard","TroopsController.leaderboard")

    Route.post("/buzzer","TroopsController.store")

    Route.post("/buzzer/tweet","TweetsController.store")

    Route.get("/c/:id","CampaignsController.show")

    Route.put("/attendance/:id","CampaignsController.updateAttendance")

    Route.put("/score/:id","CampaignsController.updateScore")

    Route.post("/buzzer/logout","TroopsController.logout")

    Route.get("/omoo","ChannelsController.index")

    Route.get("/channel/create","ChannelsController.create")

    Route.post('/channel', "ChannelsController.store")

    Route.get("/channel/:id","ChannelsController.show")

    Route.get("/channel/:id/edit","ChannelsController.edit")

    Route.put("/channel/:id","ChannelsController.update")

    Route.post("/channel/:id/members","ChannelsController.members")

    Route.post("/channel/members","ChannelsController.deleteMember")

    Route.resource("/channel/:channel_id/content","ContentsController")

   Route.post('/upload', "UploadsController.store")

   Route.post('/tsq-upload', "TsqUploadsController.store")
 

   Route.put("/start-campaign/:id","CampaignsController.startCampaign")

   Route.put("/end-campaign/:id","CampaignsController.endCampaign")

   Route.resource("/bank-tsaqofah","BankTsaqofahsController").except(['show'])

    

  }).middleware(['buzzer'])

  Route.post("/request-otp","TroopsController.requestOTP")

  Route.get("/api/article","GuestArticlesController.index")

  Route.post("/api/login","OmooAuthsController.login")

  Route.post("/api/check-otp","OmooAuthsController.verifyOTP")

  Route.post("/api/verify-token","OmooAuthsController.verifyToken")

  Route.get("/api/check","OmooAuthsController.check")

  Route.get("/api/quran","GuestArticlesController.ayat")

  Route.get("/api/surah","QuransController.index")

  Route.get("/api/surah/:id","QuransController.show")

  Route.get("/api/random-ayat","QuransController.randomAyat")

  Route.get("/api/adzan/:location/:year/:month","QuransController.adzan")


  Route.group(()=>{

    Route.get("/publist","ContentsController.publist")

    Route.get("/contents/omoo","ContentsController.omoo")

    Route.get("/contents/popup","ContentsController.popupcontent")

    Route.get("/contents/terkini","ContentsController.latest")

    Route.get("/contents/trending","ContentsController.trending")

    Route.get("/contents/official","ContentsController.official")

    Route.put("/contents/:id","ContentsController.update")

    Route.put("/contents/share/:id","ContentsController.share")
    Route.put("/contents/like/:id","ContentsController.like")
    Route.put("/contents/dislike/:id","ContentsController.dislike")
    Route.post("/daily-tweet","ContentsController.dailyTweet")

    Route.post("/profile","OmooAuthsController.profile")
 

    Route.post("/pin","OmooAuthsController.setPin")

    Route.post("/logout","OmooAuthsController.logout")

    Route.get("/bank-tsaqofah/terkini","BankTsaqofahsController.indexOmoo")

    Route.get("/bank-tsaqofah/:id","BankTsaqofahsController.showOmoo")


  }).middleware(['api']).prefix("/api")

