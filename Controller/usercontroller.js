// Purchase History
exports.getPurchaseHistory = async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) return res.redirect('/Login');
    const purchases = await require('../Models/PurchaseRequest').findByBuyerId(currentUser.userId);
    // Optionally populate clothes info
    const Clothes = require('../Models/Addclothes');
    const clothesMap = {};
    for (const p of purchases) {
      if (p.clothesId && !clothesMap[p.clothesId]) {
        clothesMap[p.clothesId] = await Clothes.findById(p.clothesId);
      }
    }
    res.render('purchaseHistory', { purchases, clothesMap });
  } catch (error) {
    console.error('Error loading purchase history:', error);
    res.render('purchaseHistory', { purchases: [], clothesMap: {} });
  }
};

// Sales History
exports.getSalesHistory = async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) return res.redirect('/Login');
    const sales = await require('../Models/PurchaseRequest').findBySellerId(currentUser.userId);
    // Optionally populate clothes info
    const Clothes = require('../Models/Addclothes');
    const clothesMap = {};
    for (const s of sales) {
      if (s.clothesId && !clothesMap[s.clothesId]) {
        clothesMap[s.clothesId] = await Clothes.findById(s.clothesId);
      }
    }
    res.render('salesHistory', { sales, clothesMap });
  } catch (error) {
    console.error('Error loading sales history:', error);
    res.render('salesHistory', { sales: [], clothesMap: {} });
  }
};
const UserFeedback = require('../Models/Feedback');
const Clothes = require('../Models/Addclothes');
const UserAccount = require('../Models/Account');

exports.getHome = (req, res, next) => {
  Clothes.fetchAll()
    .then(cloth => {
      const activeClothes = cloth.filter(c => c.status !== 'sold');
      res.render('home', { colthList: activeClothes });
    })
    .catch(error => {
      console.error('Error loading home page:', error);
      res.render('home', { colthList: [] });
    });
};

exports.getSignup = (req, res, next) => {
  res.render('Signin');
};

exports.getLogin = (req, res, next) => {
  res.render('Login', { error: null, successMessage: null });
};

exports.getFeedbackForm = (req, res, next) => {
  UserFeedback.fetchAll()
    .then(feed => {
      res.render('Feedback', { givenFeed: feed });
    })
    .catch(error => {
      console.error('Error loading feedback:', error);
      res.render('Feedback', { givenFeed: [] });
    });
};

exports.getItemListing = (req, res, next) => {
  Clothes.fetchAll()
    .then(cloth => {
      const activeClothes = cloth.filter(c => c.status !== 'sold');
      res.render('itemlisting', { colthList: activeClothes });
    })
    .catch(error => {
      console.error('Error loading item listing:', error);
      res.render('itemlisting', { colthList: [] });
    });
};

exports.getuserDashboard = async (req, res, next) => {
  try {
    const currentUser = req.user;

    // Fetch user's clothes and account data in parallel
    const [cloth, user] = await Promise.all([
      Clothes.findByUserId(currentUser.userId),
      UserAccount.findById(currentUser.userId)
    ]);

    const fullName = [currentUser.firstname, currentUser.lastname].filter(Boolean).join(' ') || 'Community Member';
    const userPoints = user ? user.points : 100;

    res.render('userDashboard', {
      userClothes: cloth,
      userClothesCount: cloth.length,
      userPurchasesCount: 0,
      userName: fullName,
      userEmail: currentUser.email || 'member@swapstyle.app',
      userPoints: userPoints
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    const currentUser = req.user;
    const fullName = [currentUser.firstname, currentUser.lastname].filter(Boolean).join(' ') || 'Community Member';
    
    res.render('userDashboard', {
      userClothes: [],
      userClothesCount: 0,
      userPurchasesCount: 0,
      userName: fullName,
      userEmail: currentUser && currentUser.email ? currentUser.email : 'member@swapstyle.app',
      userPoints: 100
    });
  }
};

exports.getaddClothes = (req, res, next) => {
  Clothes.findByUserId(req.user.userId)
    .then(cloth => {
      res.render('addclothes', { listedItems: cloth });
    })
    .catch(error => {
      console.error('Error loading add clothes page:', error);
      res.render('addclothes', { listedItems: [] });
    });
};
