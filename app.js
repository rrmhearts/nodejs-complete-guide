require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`+
                    '/shop'; // using shop db for both.

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
}); // constructor

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret string', /*signing hash for id in cookie*/
  resave: false, /*only if something changes*/
  saveUninitialized: false, /*cookie: {maxAge:... expires...}*/
  store: store, /* store session data in mongodb! (FOR PRODUCTION ~~ more secure, will not overload memory)*/ 
  cookie: { /* can add cookie related info here */ }
}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Only if route is not in shopRoutes
app.use(authRoutes);

// If request does not have a route above!
app.use(errorController.get404);

mongoose.connect(MONGODB_URI+'?retryWrites=true&w=majority')
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
