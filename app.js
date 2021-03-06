require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`+
                    '/shop'; // using shop db for both.

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
}); // constructor

/***
 * Using CSRF Token to prevent Cross Site Request Forgery.
 *   Attacker links a fake view that uses your backend.
 *   Fake View sends link/post request to your own page/server.
 */
const csrfProtection = csrf(); // middleware

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
}));
app.use(csrfProtection); // requires session
app.use(flash()); // requires session

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  // Use session to remake model.
  User.findById(req.session.user._id)
    .then(user => {
      // only stores data. MongoDBStore does not know about Mongoose models!
                      // This doesn't store/fetch Mongoose methods!
      // Use session to feed this request.. as Mongoose Model.
      req.user = user // mongoose model user!
      next();
    })
    .catch(err => console.log(err));
});

/* Crucial feature! Must add to every project that uses POST. */
app.use((req, res, next) => {
  // local variable for a single view.
  // These vars will be available in each response page.
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // each respose will have a unique token set.
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Only if route is not in shopRoutes
app.use(authRoutes);

// If request does not have a route above!
app.use(errorController.get404);

mongoose.connect(MONGODB_URI+'?retryWrites=true&w=majority')
  .then(result => {
    /*** Now we have creat user flow
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
*/
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
