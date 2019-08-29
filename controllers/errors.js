exports.getError404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/404',
        productsCSS: false,
        formsCSS: false,
        errorCSS: true
    }); // Passing data into templating engine DOESN't change
};