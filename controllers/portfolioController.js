const path = require('path');
const { v4: uuidv4 } = require('uuid');
const store = require('../utils/jsonStore');

exports.list = (req, res) => {
  const items = store.read('portfolio');
  const isTeam = req.session.user?.role === 'team';
  res.render('portfolio/index', { title: 'Portfolio', items, isTeam });
};

exports.create = (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : '/uploads/placeholder-1.svg';
  store.upsert('portfolio', {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    image
  });
  res.redirect('/portfolio');
};

exports.remove = (req, res) => {
  store.remove('portfolio', req.params.id);
  res.redirect('/portfolio');
};
