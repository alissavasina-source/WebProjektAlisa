const { v4: uuidv4 } = require('uuid');
const store = require('../utils/jsonStore');

exports.showForm = (req, res) => {
  const services = store.read('services');
  const team = store.read('team');
  res.render('booking/index', { title: 'Termin buchen', services, team, success: null, error: null });
};

exports.create = (req, res) => {
  const { serviceId, teamMemberId, date, time, customerName, customerEmail, customerPhone } = req.body;
  const service = store.findById('services', serviceId);
  const member = store.findById('team', teamMemberId);

  if (!service || !member || !date || !time) {
    const services = store.read('services');
    const team = store.read('team');
    return res.render('booking/index', {
      title: 'Termin buchen',
      services,
      team,
      success: null,
      error: 'Bitte alle Pflichtfelder ausfüllen.'
    });
  }

  const existing = store.read('appointments').find(
    (a) => a.teamMemberId === teamMemberId && a.date === date && a.time === time
  );

  if (existing) {
    const services = store.read('services');
    const team = store.read('team');
    return res.render('booking/index', {
      title: 'Termin buchen',
      services,
      team,
      success: null,
      error: 'Dieser Termin ist bereits belegt. Bitte andere Uhrzeit wählen.'
    });
  }

  store.upsert('appointments', {
    id: uuidv4(),
    serviceId,
    serviceName: service.name,
    teamMemberId,
    teamMemberName: member.name,
    date,
    time,
    customerName,
    customerEmail,
    customerPhone,
    userId: req.session.user?.id || null,
    createdAt: new Date().toISOString()
  });

  res.render('booking/index', {
    title: 'Termin buchen',
    services: store.read('services'),
    team: store.read('team'),
    success: `Termin bestätigt: ${service.name} bei ${member.name} am ${date} um ${time} Uhr.`,
    error: null
  });
};

