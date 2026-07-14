const { v4: uuidv4 } = require('uuid');
const store = require('../utils/jsonStore');

exports.index = (req, res) => {
  const services = store.read('services').slice(0, 3);
  const portfolio = store.read('portfolio').slice(0, 3);
  res.render('index', { title: 'Startseite', services, portfolio });
};

exports.list = (req, res) => {
  const services = store.read('services');
  const isTeam = req.session.user?.role === 'team';
  res.render('services/index', { title: 'Services', services, isTeam });
};

