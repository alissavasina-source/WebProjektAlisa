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

//Produkt
exports.createProduct = (req, res) => {
  console.log('--- NEUER UPLOAD-VERSUCH ---');
  console.log('Erhaltener Text-Body:', req.body); // Sollte Name, Preis etc. zeigen
  console.log('Erhaltener Date-req.file:', req.file); // <--- DAS IST ENTSCHEIDEND!
  console.log('---------------------------');
  let imagePath = '/uploadsProduct/produktPlaceholder.png';
   if (req.file) {
    // Da dein Ordner 'public/uploadsTeam' heißt, lautet der Pfad für den Browser '/uploadsTeam/dateiname'
    imagePath = `/uploadsProduct/${req.file.filename}`;
  }
  store.upsert('products', {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    stock: parseInt(req.body.stock, 10),
    category: req.body.category,
    imagePath:imagePath,
  });
  res.redirect('/admin/produkt');
};

exports.updateProduct = (req, res) => {
  const existing = store.findById('products', req.params.id);
  if (!existing) return res.redirect('/admin/produkt');

  let imagePath = existing.imagePath ||'/uploadsProduct/produktPlaceholder.png';
   if (req.file) {
    imagePath = `/uploadsProduct/${req.file.filename}`;
  }

  store.upsert('products', {
    ...existing,
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    stock: parseInt(req.body.stock, 10),
    category: req.body.category,
    imagePath:imagePath,
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
//home
exports.updateHome = (req, res) => {
 // console.log("Formular-Text:", req.body);
 // console.log("Hochgeladene Datei:", req.file);
  const data = store.read('homepage') || [];
  const existing = data.find(item => item.id === 'hero-content');

  // Wenn kein neues Bild hochgeladen wurde, nimm das existierende.
  // Wenn es das auch nicht gibt, nimm das originale Standardbild!
  let imagePath = '/uploads/startseite.jpg';
  if (existing && existing.imagePath) {
    imagePath = existing.imagePath;
  }
  
  // Falls die Admin-Person ein neues Bild hochgeladen hat, überschreiben wir es
  if (req.file) {
    imagePath = `/uploadsProduct/${req.file.filename}`;
  }

  // In der JSON speichern/aktualisieren
  store.upsert('homepage', {
    id: 'hero-content', // Bleibt immer gleich
    welcomeText: req.body.welcomeText,
    imagePath: imagePath
  });
};
exports.showAdminHome = (req, res) => {
  // Aktuelle Daten aus der JSON lesen, damit der Admin sieht, was gerade live ist
  const data = store.read('homepage') || [];
  let content = data.find(item => item.id === 'hero-content');

  // Falls noch nichts in der JSON steht, leere Standardwerte übergeben
  if (!content) {
    content = {
      welcomeText: 'Ihr Friseursalon für moderne Haarschnitte, Styling und Beratung.',
      imagePath: '/uploadsProduct/home.jpg'
    };
  }

  // Rendert die Datei: views/admin/home.ejs
  res.render('admin/home', { content }); 
};