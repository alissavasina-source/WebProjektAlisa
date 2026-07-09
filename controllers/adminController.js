const { v4: uuidv4 } = require('uuid');
const store = require('../utils/jsonStore');

// Hilfsfunktion für das Profil (sucht das passende Teammitglied basierend auf der User-ID)
function getMemberForUser(userId) {
  const team = store.read('team') || [];
  return team.find(m => m.userId === userId || m.id === userId);
}
//booking
exports.showBookingList = (req, res) => {
  const appointments = store.read('appointments');
  const currentDate = new Date();
  const validAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= currentDate;
  });
  store.write('appointments', validAppointments);
  res.render('admin/list', { title: 'Termine', appointments });
};
exports.deleteAppointment = (req, res) => {
    const appointmentId = req.params.id; 
    store.remove('appointments', appointmentId);  
    res.redirect('/admin/list'); 
};

//portfolio
exports.listPortfolio = (req, res) => {
  const items = store.read('portfolio');
  const isTeam = req.session.user?.role === 'team';
  res.render('admin/portfolio', { title: 'Portfolio', items, isTeam,
  });
};

exports.createPortfolio = (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : '/uploads/placeholder-1.svg';
  store.upsert('portfolio', {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    image
  });
  res.redirect('/admin/portfolio');
};

exports.removePortfolio= (req, res) => {
  store.remove('portfolio', req.params.id);
  res.redirect('/admin/portfolio');
};

exports.showPortfolio = (req, res) => {
  // Rendert die Datei views/portfolio.ejs und übergibt einen Titel
  res.render('admin/portfolio', { title: 'Portfolio / Bildergalerie' });
};
//Produkt
exports.createProduct = (req, res) => {
  store.upsert('products', {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    stock: parseInt(req.body.stock, 10)
  });
  res.redirect('/admin/produkt');
};

exports.updateProduct = (req, res) => {
  const existing = store.findById('products', req.params.id);
  if (!existing) return res.redirect('/admin/produkt');

  store.upsert('products', {
    ...existing,
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    stock: parseInt(req.body.stock, 10)
  });
  res.redirect('/admin/produkt');
};
exports.removeProduct= (req, res) => {
  store.remove('products', req.params.id);
  res.redirect('/admin/produkt');
};
//services
exports.createService= (req, res) => {
  const service = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    duration: parseInt(req.body.duration, 10)
  };
  store.upsert('services', service);
  res.redirect('/admin/services');
};

exports.updateService = (req, res) => {
  const existing = store.findById('services', req.params.id);
  if (!existing) return res.redirect('/admin/services');

  store.upsert('services', {
    ...existing,
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    duration: parseInt(req.body.duration, 10)
  });
  res.redirect('/admin/services');
};

exports.removeService = (req, res) => {
  store.remove('services', req.params.id);
  res.redirect('/admin/services');
};
//profile
exports.updateProfile = (req, res) => {
  const member = getMemberForUser(req.session.user.id);
  if (!member) return res.redirect('/team/registrieren');

  const { role, bio, services: serviceIds } = req.body;
  const selectedServices = Array.isArray(serviceIds) ? serviceIds : serviceIds ? [serviceIds] : [];

  let imagePath = member.imagePath || '';

  // NEU: Wenn ein neues Bild hochgeladen wurde, überschreiben wir den Pfad
  if (req.file) {
    // Da dein Ordner 'public/uploadsTeam' heißt, lautet der Pfad für den Browser '/uploadsTeam/dateiname'
    imagePath = `/uploadsTeam/${req.file.filename}`;
  }

  store.upsert('team', {
    ...member,
    name: req.body.name || member.name,
    role: role || member.role,
    bio: bio || '',
    services: selectedServices,
    imagePath: imagePath,
  });

  const services = store.read('services');
  res.render('admin/profile', { title: 'Mein Profil', member: getMemberForUser(req.session.user.id), services, saved: true });
};

exports.showProfile = (req, res) => {
  const member = getMemberForUser(req.session.user.id);
  if (!member) {
    return res.redirect('/team/registrieren');
  }
  const services = store.read('services');
  res.render('admin/profile', { title: 'Mein Profil', member, services, saved: false,});
  };
//Produkts
  exports.showProducts = (req, res) => {
  const products = store.read('products') || [];
  res.render('admin/produkt', { title: 'Produkte verwalten', products }); // Hier heißt es "products"
};
exports.listServices = (req, res) => {
  const services = store.read('services') || [];
  // Rendert die Admin-Ansicht und übergibt die Services
  res.render('admin/services', { title: 'Services verwalten', services });
};