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

exports.create = (req, res) => {
  const service = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    duration: parseInt(req.body.duration, 10)
  };
  store.upsert('services', service);
  res.redirect('/services');
};

exports.update = (req, res) => {
  const existing = store.findById('services', req.params.id);
  if (!existing) return res.redirect('/services');

  store.upsert('services', {
    ...existing,
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    duration: parseInt(req.body.duration, 10)
  });
  res.redirect('/services');
};

exports.remove = (req, res) => {
  store.remove('services', req.params.id);
  res.redirect('/services');
};
