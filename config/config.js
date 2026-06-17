module.exports = {
  salonName: 'Salon Elegance',
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'friseursalon-geheim',
  dataDir: './data',
  uploadDir: './public/uploads'
};
