require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret string', resave: false/*only if something changes*/,
  saveUninitialized: false, /*cookie: {maxAge:... expires...}*/
}));

/* Middle ware to login a user */
app.use((req, res, next) => {
  User.findById('5df9303a0bed90442e55d5cd')
    .then(user => {
        // Create model in order to use methods.
      req.user = user;

      // Go to next route!
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Only if route is not in shopRoutes
app.use(authRoutes);

// If request does not have a route above!
app.use(errorController.get404);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`+
'/shop?retryWrites=true&w=majority')
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Ryan',
          email: 'ryan@test.com',
          cart: {
            items: []
          }
        }).save();
      }
    })

    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
