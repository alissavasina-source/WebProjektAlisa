const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const store = require('../utils/jsonStore');

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Anmelden', error: null });
};

exports.showRegister = (req, res) => {
  res.render('auth/register', { title: 'Registrieren', error: null, isTeam: req.query.team === '1' });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = store.read('users').find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.render('auth/login', { title: 'Anmelden', error: 'E-Mail oder Passwort falsch.' });
  }

  req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role };
  const returnTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(returnTo);
};

exports.register = (req, res) => {
  const { name, email, password, role } = req.body;
  const isTeam = role === 'team';
  const users = store.read('users');

  if (users.some((u) => u.email === email)) {
    return res.render('auth/register', {
      title: 'Registrieren',
      error: 'Diese E-Mail ist bereits registriert.',
      isTeam
    });
  }

  const user = {
    id: uuidv4(),
    email,
    name,
    password: bcrypt.hashSync(password, 10),
    role: isTeam ? 'team' : 'customer'
  };
  store.upsert('users', user);

  if (isTeam) {
    store.upsert('team', {
      id: uuidv4(),
      userId: user.id,
      name,
      role: 'Neues Teammitglied',
      bio: '',
      services: [],
      tasks: []
    });
  }

  req.session.user = { id: user.id, email, name, role: user.role };
  res.redirect(isTeam ? '/admin/profile' : '/');
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
