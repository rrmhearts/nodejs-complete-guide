exports.getLogin = (req, res, next) => {

    // Use cookie-parser
    // Sensitive data should never be stored client side!
    // Cookies can be sent to multiple pages
    const cookie = req.get('Cookie');
    const isLoggedIn = cookie ? cookie.split('=')[1] === 'true' /* text always true*/ : false;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    /*
        Redirect to here creates a brand new requst.
        Requests are independent of each other!
      */
    req.isLoggedIn = true; // Solutions? 1) Global variable? NO, all users would get it.
                           //            2) Save cookie is users browser. Send with requests.
    res.setHeader('Set-Cookie', 'loggedIn=true'); //Max-Age=10 //Secure' /*only https*/
    //HttpOnly for httponly traffic

    // Request dies when we send response!
    res.redirect('/'); // resPONSE
};