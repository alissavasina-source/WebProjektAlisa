const express = require('express');
const path = require('path');
const session = require('express-session');
const config = require('./config/config');
const { attachUser } = require('./middleware/auth');
const homeController = require('./controllers/homeController');


const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const portfolioRoutes = require('./routes/portfolio');
const bookingRoutes = require('./routes/booking');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const teamRoutes = require('./routes/team');
const adminRoutes = require('./routes/admin');

const app = express();

const morgan = require('morgan'); // Importiere morgan für Logging
app.use(morgan('dev')); // Morgan als Middleware verwenden, um HTTP-Anfragen zu protokollieren
// dev zeigt die farbige Ausgabe im Terminal an, was die Lesbarkeit verbessert.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(attachUser);
app.locals.salonName = config.salonName;

app.get('/', homeController.index);

app.use('/', authRoutes);
app.use('/services', servicesRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/termin', bookingRoutes);
app.use('/produkte', productsRoutes);
app.use('/warenkorb', cartRoutes);
app.use('/team', teamRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('error', { title: 'Nicht gefunden', message: 'Seite nicht gefunden.' });
});

module.exports = app;
