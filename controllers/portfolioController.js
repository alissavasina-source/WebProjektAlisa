const path = require('path');
const { v4: uuidv4 } = require('uuid');
const store = require('../utils/jsonStore');

exports.list = (req, res) => {
  const items = store.read('portfolio');
  const isTeam = req.session.user?.role === 'team';
  res.render('portfolio/index', { title: 'Portfolio', items, isTeam,
  });
};


