const store = require('../utils/jsonStore');

exports.index = (req, res) => {
  const services = store.read('services').slice(0, 3);
  const portfolio = store.read('portfolio').slice(0, 3);
  res.render('index', { title: 'Startseite', services, portfolio });
};
