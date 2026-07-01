const { v4: uuidv4 } = require('uuid');
const store = require('../utils/jsonStore');

exports.list = (req, res) => {
  const products = store.read('products');
  const isTeam = req.session.user?.role === 'team';
  res.render('products/index', { title: 'Produkte', products, isTeam });
};



exports.addToCart = (req, res) => {
  const product = store.findById('products', req.params.id);
  if (!product) return res.redirect('/produkte');

  const cart = req.session.cart || [];
  const existing = cart.find((item) => item.productId === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  req.session.cart = cart;
  res.redirect('/produkte');
};

exports.showCart = (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('products/cart', { title: 'Warenkorb', cart, total });
};

exports.checkout = (req, res) => {
  const cart = req.session.cart || [];
  if (cart.length === 0) return res.redirect('/warenkorb');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  store.upsert('orders', {
    id: uuidv4(),
    userId: req.session.user.id,
    userName: req.session.user.name,
    items: cart,
    total,
    createdAt: new Date().toISOString()
  });

  cart.forEach((item) => {
    const product = store.findById('products', item.productId);
    if (product) {
      store.upsert('products', { ...product, stock: Math.max(0, product.stock - item.quantity) });
    }
  });

  req.session.cart = [];
  res.render('products/order-success', { title: 'Bestellung', total });
};

exports.removeFromCart = (req, res) => {
  req.session.cart = (req.session.cart || []).filter((item) => item.productId !== req.params.id);
  res.redirect('/warenkorb');
};
exports.details = (req, res) => {
  const product = store.findById('products', req.params.id);

  if (!product) {
    return res.status(404).send("Produkt nicht gefunden");
  }

  res.render('products/details', {
    title: product.name,
    product,
    user: req.session.user
  });
};