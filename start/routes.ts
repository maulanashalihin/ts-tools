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

    Route.put("/troops/:id","TroopsController.update")

    Route.get("/download-troops","TroopsController.download")

    Route.get("/messages","MessagesController.index")

    

    Route.get("/omoo-channels","ChannelsController.admins")

    Route.get("/omoo-contents","ContentsController.index")

    Route.put("/omoo-contents/:id","ContentsController.update")

    Route.put("/make-official-channel/:id","ChannelsController.makeOfficial")

    Route.put("/messages/:id","MessagesController.update")

    Route.post("/logout","AuthController.logout")

    Route.post("/api-keys","MessagesController.storeApiKey")

    Route.delete("/api-keys/:id","MessagesController.deleteApiKey")

  }).middleware(['auth'])

  Route.get("/ts-login",({inertia})=>{
    return inertia.render("ts-login")
  })

  Route.get("/troop-register",({inertia})=>{
    return inertia.render("ts-register-2")
  })
  
  Route.post("/ts-login","TroopsController.login")

  Route.post("/ts-register","TroopsController.register")

  Route.post("/ts-otp","TroopsController.verifyOTP")
  

  Route.group(()=>{

    Route.get("/","TroopsController.home")

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

    Route.resource("/channel/:channel_id/content","ContentsController")

   Route.post('/upload', "UploadsController.store")

   Route.put("/start-campaign/:id","CampaignsController.startCampaign")

   Route.put("/end-campaign/:id","CampaignsController.endCampaign")
    

  }).middleware(['buzzer'])

  Route.post("/request-otp","TroopsController.requestOTP")

  Route.get("/api/article","GuestArticlesController.index")

  Route.post("/api/login","OmooAuthsController.login")

  Route.post("/api/check-otp","OmooAuthsController.verifyOTP")

  Route.get("/api/check","OmooAuthsController.check")



  Route.group(()=>{

    Route.get("/contents/home","ContentsController.latest")

    Route.get("/contents/trending","ContentsController.trending")

    Route.get("/contents/official","ContentsController.official")

    Route.put("/contents/:id","ContentsController.update")

    Route.put("/contents/share/:id","ContentsController.share")
    Route.put("/contents/like/:id","ContentsController.like")
    Route.put("/contents/dislike/:id","ContentsController.dislike")
    Route.post("/daily-tweet","ContentsController.dailyTweet")

    Route.post("/logout","OmooAuthsController.logout")

  }).middleware(['api']).prefix("/api")