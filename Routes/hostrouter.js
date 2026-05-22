const express = require('express');
const hostrouter = express.Router();
const hostcontroller = require('../Controller/hostcontroller');
const { requireAdmin, requireAuth, requireGuest } = require('../middleware/auth');

hostrouter.post("/addAccount", requireGuest, hostcontroller.postAddAccount);

hostrouter.post("/accountExist", requireGuest, hostcontroller.postAccountExist);

hostrouter.post("/submitFeedback", hostcontroller.postFeedback);

hostrouter.get("/getFeedback", hostcontroller.getFeedback);

hostrouter.get("/getadminpannel" , requireAdmin, hostcontroller.getadminpannel);
hostrouter.post("/admin/delete-user", requireAdmin, hostcontroller.postDeleteUser);

hostrouter.post("/addClothes" , requireAuth, hostcontroller.postAddClothes);

module.exports = hostrouter;
