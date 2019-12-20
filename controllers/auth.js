exports.getLogin = (req, res, next) => {

    // Use cookie-parser
    // Sensitive data should never be stored client side!
    // Cookies can be sent to multiple pages
    //const cookie = req.get('Cookie');
    //const isLoggedIn = cookie ? cookie.split('=')[1] === 'true' /* text always true*/ : false;
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
    // Sessions are stored serverside!
};

exports.postLogin = (req, res, next) => {
    /*
        Redirect to here creates a brand new requst.
        Requests are independent of each other!
      */
    req.session.isLoggedIn = true; // Solutions? 1) Global variable? NO, all users would get it.
                           //            2) Save cookie is users browser. Send with requests.
    //res.setHeader('Set-Cookie', 'loggedIn=true'); //Max-Age=10 //Secure' /*only https*/
    //HttpOnly for httponly traffic

    /* Express Session will set cookie to identify you to server, but encrypted. */

    // Request dies when we send response!
    res.redirect('/'); // resPONSE
};