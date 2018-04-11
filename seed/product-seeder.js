var Product = require('../models/product');
var {SuperUser} = require('../models/user');

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URI);

var products = [
  new Product({
    imagePath: 'https://www.dominos.co.in/files/items/Double_Cheese_Margherita.jpg',
    title: 'DOUBLE CHEESE MARGHERITA',
    description: 'The ever-popular Margherita - loaded with extra cheese... oodies of it!',
    price: 269,
    category: 'Veg Pizza'
  }),
  new Product({
    imagePath: 'https://www.dominos.co.in/files/items/Peppy_Paneer.jpg',
    title: 'PEPPY PANEER',
    description: 'Chunky paneer with crisp capsicum and spicy red pepper - quite a mouthful!',
    price: 209,
    category: 'BestSeller'
  }),
  new Product({
    imagePath: 'https://www.dominos.co.in/files/items/Paneer_Makhni.jpg',
    title: "PANEER MAKHANI",
    description: "Paneer and Capsicum on Makhani Sauce",
    price: 99
  })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {

      //Add a admin account too!
      var admin = SuperUser();
      admin.name = 'admin';
      admin.employeeId = '1';
      admin.email = 'admin@dominos.com';
      admin.password = admin.encryptPassword('admin');
      admin.save(function(err, result){
        exit();  
      });
    }
  });
}

function exit() {
  mongoose.disconnect();
}