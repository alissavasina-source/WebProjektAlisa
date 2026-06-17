function requireLogin(req, res, next) {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/anmelden');
  }
  next();
}

function requireTeam(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'team') {
    return res.status(403).render('error', {
      title: 'Zugriff verweigert',
      message: 'Diese Seite ist nur für Teammitglieder.'
    });
  }
  next();
}

function attachUser(req, res, next) {
  res.locals.user = req.session.user || null;
  res.locals.cartCount = (req.session.cart || []).reduce((sum, item) => sum + item.quantity, 0);
  next();
}

module.exports = { requireLogin, requireTeam, attachUser };
