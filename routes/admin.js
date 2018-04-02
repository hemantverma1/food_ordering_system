var cookieParser = require('cookie-parser')
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var multer = require('multer');
var Product = require('../models/product');

var path = require('path');
var appDir = path.dirname(require.main.filename);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var Order = require('../models/order');


var csrfProtection = csrf({ cookie: true });
router.use(csrfProtection);


var Storage = multer.diskStorage({

     destination: function(req, file, callback) {

         callback(null, "./public/Images");

     },

     filename: function(req, file, callback) {

         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);

     }

});

router.use("/public", express.static('public'));

var upload = multer({
     storage: Storage
}).array("image_field",1); //Field name and max count

router.get('/vieworders', isLoggedIn, function(req, res, next) {

  Order.find({}, function(err, orders) {
    var orderMap = {};

    orders.forEach(function(order) {
      orderMap[order._id] = order;
    });

    res.render('admin/vieworders', {
        csrfToken: req.csrfToken(),
        orderMap: orderMap,
        user: req.user
    });

  });

});

router.get('/remove-order/:id',isLoggedIn, function(req, res, next) {
  console.log("Deleted Order");
  Order.findByIdAndRemove(req.params.id, function (err) {});
  res.redirect('/admin/vieworders');
});

router.get('/ontheway-order/:id',isLoggedIn, function(req, res, next) {
  Order.findById(req.params.id, function(err, order)
  {
    order.preparing = false;
    order.ontheway = true;
    order.delivered = false;
    order.save(function (err) { res.redirect('/admin/vieworders');});
  });
});

router.get('/delivered-order/:id',isLoggedIn, function(req, res, next) {
  Order.findById(req.params.id, function(err, order)
  {
    order.preparing = false;
    order.ontheway = false;
    order.delivered = true;
    order.save(function (err) { res.redirect('/admin/vieworders');});
  });
});


router.get('/', isLoggedIn, function(req, res) {
    res.redirect('/admin/modify-item');
});

router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/adminsignin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/signin', passport.authenticate('local.supersignin', {
  failureRedirect: 'signin',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/admin ');
  }
});

router.get('/modify-item', isLoggedIn, function(req, res, next) {
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
    res.render('shop/modify-item', {
      title: 'Food Ordering System',
      products: productChunks,
      successMsg: successMsg,
      noMessages: !successMsg
    });
  });
});

router.get('/remove-item/:id',isLoggedIn, function(req, res, next) {
  Product.findByIdAndRemove(req.params.id, function (err) {});
  req.flash('success', 'Item removed from the Menu');
  res.redirect('/admin/modify-item');
});


router.get('/add-item',isLoggedIn, function(req, res, next) {
    res.render('shop/add-item',{
      csrfToken: req.csrfToken()
    });
});


router.post('/add-item',isLoggedIn, function(req, res, next) {
  upload(req, res, function(err) {
    Product.create({
        title: req.body.title_field, 
        description: req.body.desc_field, 
        price: req.body.price_field, 
        imagePath: req.files[0].path, 
        category: req.body.category_field
      }, function (err) { console.log(err)}
    );
  });
  res.redirect('/admin/modify-item');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req['user'].employeeId) {
    return next();
  }
  res.redirect('/admin/signin');
}