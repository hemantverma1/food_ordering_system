var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var {User} = require('../models/user');

var Product = require('../models/product');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  var productChunks = {};
  Product.distinct('category', function(err, categories){
    categories.forEach(function(cat) {
      productChunks[cat] = [];
      Product.find({category : cat}, function(err, docs){
        docs.forEach((item) => {
          productChunks[cat].push(item);
        });
      });
    });
    res.render('shop/index', {
      title: 'Food Ordering System',
      products: productChunks,
      successMsg: successMsg,
      noMessages: !successMsg
    });
  });
});

router.use("/public", express.static('public'));


router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

router.post('/shopping-cart', function(req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  if(req.body.inst){
    cart.addInstructions(req.body.inst);
    req.session.cart = cart;
  } 
  return res.redirect('/checkout');
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {
    total: cart.totalPrice,
    errMsg: errMsg,
    noError: !errMsg
  });
});


router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
      console.log("Failed!!");
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var order = new Order({
    user: req.user,
    cart: cart,
    address: req.user.state,
    name: req.user.name,
    paymentId: 'PAID',
    date: getdatestr(),
    time: gettimestr(),
    preparing: true,
    ontheway: false,
    delivered: false
  });

  order.save(function(err, result) {
    req.flash('success', 'Food ordered successfully!');
    req.session.cart = null;
    res.redirect('/');
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}

function getdatestr() {

  var today = new Date();
  var dd = today.getDate();

  var mm = today.getMonth() + 1; 
  var yyyy = today.getFullYear();

  if (dd < 10) {
      dd = '0' + dd;
  } 

  if (mm < 10 ) {
      mm = '0' + mm;
  }

  today = dd + '/' + mm + '/' + yyyy;
  return today;
}

function gettimestr() {
  var d = new Date(),
      h = (d.getHours()<10?'0':'') + d.getHours(),
      m = (d.getMinutes()<10?'0':'') + d.getMinutes();
  return (h + ':' + m);
}
