const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'swapstyle-jwt-super-secret-key';

exports.attachAuthLocals = (req, res, next) => {
  const token = req.cookies && req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      res.locals.isAuthenticated = true;
      res.locals.currentUser = decoded;
    } catch (err) {
      req.user = null;
      res.locals.isAuthenticated = false;
      res.locals.currentUser = null;
      res.clearCookie('token');
    }
  } else {
    req.user = null;
    res.locals.isAuthenticated = false;
    res.locals.currentUser = null;
  }
  next();
};

exports.requireAuth = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.redirect('/Login');
};

exports.requireUser = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      return res.redirect('/getadminpannel');
    }
    return next();
  }
  return res.redirect('/Login');
};

exports.requireGuest = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      return res.redirect('/getadminpannel');
    }
    return res.redirect('/userDashboard');
  }
  return next();
};

exports.requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.redirect('/userDashboard');
};
