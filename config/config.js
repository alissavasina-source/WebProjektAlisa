module.exports = {
  salonName: 'Haarschnitt-Atelie-Kassel',
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'friseursalon-geheim',
  dataDir: './data',
  uploadDir: './public/uploads'
};
