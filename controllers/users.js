const User = require('../models/user');



module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password); // check duplicate username and register ac, do the salting and hashing the pw
        req.login(registeredUser, err => {
            if (err) return next(err);
            console.log('\nRegistered new user\n');
            req.flash('success', 'Welcome to Sneakers World!\n');
            res.redirect('/'); 
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/users/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = async (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back ${username} !`);
    const redirectUrl = res.locals.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err) };
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    })
}
