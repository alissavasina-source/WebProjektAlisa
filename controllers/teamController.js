const { v4: uuidv4 } = require('uuid');
const store = require('../utils/jsonStore');

function getMemberForUser(userId) {
  return store.read('team').find((m) => m.userId === userId);
}

exports.list = (req, res) => {
  const members = store.read('team');
  res.render('team/index', { title: 'Team', members });
};

exports.showRegister = (req, res) => {
  const existing = getMemberForUser(req.session.user.id);
  if (existing) return res.redirect('/team/profil');

  const services = store.read('services');
  res.render('team/register', { title: 'Team-Registrierung', services, error: null });
};

exports.register = (req, res) => {
  const { role, bio, services: serviceIds } = req.body;
  const selectedServices = Array.isArray(serviceIds) ? serviceIds : serviceIds ? [serviceIds] : [];
  let imagePath = '/uploadsTeam/default-avatar.png';
  if (req.file) {
    imagePath = `/uploadsTeam/${req.file.filename}`;
  }

  store.upsert('team', {
    id: uuidv4(),
    userId: req.session.user.id,
    name: req.session.user.name,
    role: role || 'Stylist/in',
    bio: bio || '',
    services: selectedServices,
    tasks: [],
    imagePath: imagePath
  });

  //res.redirect('/admin/profile');
  res.redirect('/');
};


exports.showMember = (req, res) => {
  const member = store.findById('team', req.params.id);
  if (!member) return res.redirect('/team');
  const services = store.read('services').filter((s) => member.services.includes(s.id));
  res.render('team/member', { title: member.name, member, services });
};
