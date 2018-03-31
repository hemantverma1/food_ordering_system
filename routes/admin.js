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


router.get('/', isLoggedIn, function(req, res) {
    res.send('Success');
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

router.get('/modify-item', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, docs) {
    console.log(docs.length);
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/modify-item', {
      title: 'Dominos Pizza',
      products: productChunks,
      successMsg: successMsg,
      noMessages: !successMsg
    });
  });
});

router.get('/remove-item/:id', function(req, res, next) {
  Product.findByIdAndRemove(req.params.id, function (err) {});
  res.redirect('/admin/modify-item');
});


router.get('/add-item', function(req, res, next) {
    res.render('shop/add-item',{
    csrfToken: req.csrfToken()});
});


router.post('/add-item', function(req, res, next) {
  upload(req, res, function(err) {
  var item = Product.create({title: req.body.title_field, description: req.body.desc_field, price: req.body.price_field, imagePath: req.files[0].path}, function (err) { console.log(err)});
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