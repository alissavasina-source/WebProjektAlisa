const { randomUUID } = require('crypto');
const store = require('../utils/jsonStore');

function getMemberForUser(userId) {
  return store.read('team').find((m) => m.userId === userId);
}

exports.list = (req, res) => {
  const members = store.read('team');
  res.render('team/index', {
    title: 'Team',
    members
  });
};

exports.showRegister = (req, res) => {
  const existing = getMemberForUser(req.session.user.id);

  if (existing) {
    return res.redirect('/team/profil/me');
  }

  const services = store.read('services');

  res.render('team/register', {
    title: 'Team-Registrierung',
    services,
    error: null
  });
};

exports.register = (req, res) => {
  const { role, bio, services: serviceIds } = req.body;

  const selectedServices = Array.isArray(serviceIds)
    ? serviceIds
    : serviceIds
      ? [serviceIds]
      : [];

  let imagePath = '/uploadsTeam/default-avatar.png';

  if (req.file) {
    imagePath = `/uploadsTeam/${req.file.filename}`;
  }

  store.upsert('team', {
    id: randomUUID(),
    userId: req.session.user.id,
    name: req.session.user.name,
    role: role || 'Stylist/in',
    bio: bio || '',
    services: selectedServices,
    tasks: [],
    imagePath
  });

  res.redirect('/team/profil/me');
};

exports.addTask = (req, res) => {
  const member = getMemberForUser(req.session.user.id);

  if (!member) {
    return res.redirect('/team/registrieren/me');
  }

  member.tasks = member.tasks || [];

  member.tasks.push({
    id: randomUUID(),
    title: req.body.title,
    done: false
  });

  store.upsert('team', member);

  res.redirect('/team/profil/me');
};

exports.toggleTask = (req, res) => {
  const member = getMemberForUser(req.session.user.id);

  if (!member) {
    return res.redirect('/team/registrieren/me');
  }

  const task = member.tasks.find((t) => t.id === req.params.taskId);

  if (task) {
    task.done = !task.done;
  }

  store.upsert('team', member);

  res.redirect('/team/profil/me');
};

exports.removeTask = (req, res) => {
  const member = getMemberForUser(req.session.user.id);

  if (!member) {
    return res.redirect('/team/registrieren/me');
  }

  member.tasks = (member.tasks || []).filter(
    (t) => t.id !== req.params.taskId
  );

  store.upsert('team', member);

  res.redirect('/team/profil/me');
};

exports.showMember = (req, res) => {
  const member = store.findById('team', req.params.id);

  if (!member) {
    return res.redirect('/team');
  }

  const services = store
    .read('services')
    .filter((s) => member.services.includes(s.id));

  res.render('team/member', {
    title: member.name,
    member,
    services
  });
};

exports.showProfile = (req, res) => {
  const member = getMemberForUser(req.session.user.id);

  if (!member) {
    return res.redirect('/team/registrieren/me');
  }

  const services = store
    .read('services')
    .filter((service) => member.services.includes(service.id));

  res.render('team/profile', {
    title: 'Mein Profil',
    member,
    services
  });
};

exports.updateProfile = (req, res) => {
  const member = getMemberForUser(req.session.user.id);

  if (!member) {
    return res.redirect('/team/registrieren/me');
  }

  member.role = req.body.role || member.role;
  member.bio = req.body.bio || member.bio;

  store.upsert('team', member);

  res.redirect('/team/profil/me');
};