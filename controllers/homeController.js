const store = require('../utils/jsonStore');
/*
exports.index = (req, res) => {
  const services = store.read('services').slice(0, 3);
  const portfolio = store.read('portfolio').slice(0, 3);
  res.render('index', { title: 'Startseite', services, portfolio });
};*/
exports.index = (req, res) => {
  // 1. Daten aus der JSON lesen
  const data = store.read('homepage') || [];
  
  // 2. Den richtigen Eintrag suchen (wir nutzen die feste ID 'hero-content')
  let content = data.find(item => item.id === 'hero-content');

  // 3. Wenn NOCH NIE etwas geändert wurde (content ist undefined),
  //    erstellen wir ein Standard-Objekt mit euren Original-Daten:
  if (!content) {
    content = {
      welcomeText: 'Ihr Friseursalon für moderne Haarschnitte, Styling und Beratung.',
      imagePath: '/uploadsProduct/home.jpg' // Das Standardbild, wenn noch nichts geändert wurde
    };
  }

  // 4. Daten an die Startseite übergeben
  res.render('index', { content }); 
};
