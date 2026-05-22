const express = require('express');
const userrouter = express.Router();
const usercontroller = require('../Controller/usercontroller');
const hostcontroller = require('../Controller/hostcontroller');
const { requireAuth, requireGuest, requireUser } = require('../middleware/auth');

   userrouter.get("/" ,usercontroller.getHome );

   userrouter.get("/home" ,usercontroller.getHome );

   userrouter.get("/Signin" , requireGuest, usercontroller.getSignup );

   userrouter.get("/Login" , requireGuest, usercontroller.getLogin);

  userrouter.get("/Feedback" , usercontroller.getFeedbackForm);

  userrouter.get("/itemlisting", usercontroller.getItemListing);

  userrouter.get("/userDashboard" , requireUser, usercontroller.getuserDashboard);

  userrouter.get("/addClothes" , requireUser, usercontroller.getaddClothes);

  userrouter.post("/logout", requireAuth, hostcontroller.postLogout);
  userrouter.get("/logout", requireAuth, hostcontroller.postLogout);

  // Purchase request routes
  userrouter.post("/initiatePurchase", requireUser, hostcontroller.initiatePurchase);
  userrouter.post("/acceptPurchase", requireUser, hostcontroller.acceptPurchase);
  userrouter.post("/rejectPurchase", requireUser, hostcontroller.rejectPurchase);
  userrouter.get("/purchaseRequests", requireUser, hostcontroller.getPurchaseRequests);
  userrouter.get("/myPurchaseRequests", requireUser, hostcontroller.getMyPurchaseRequests);
  userrouter.post("/deleteClothes", requireUser, hostcontroller.deleteClothes);
  // Purchase and Sales History
  userrouter.get("/purchaseHistory", requireUser, usercontroller.getPurchaseHistory);
  userrouter.get("/salesHistory", requireUser, usercontroller.getSalesHistory);

module.exports = userrouter;
