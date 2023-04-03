const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const withAuth = require('../../utils/auth');

// User Sign up
router.post('/sign-up', async (req, res) => {
    try {
        if (req.body.password.length < 8) {
            res.render('sign-up', { errorMessage: 'Password is required to be at least 8 characters or longer!' });
            return;
        }
        // Create and Store userData in db
        const userData = await User.create({
            username: req.body.username,
            password: req.body.password,
        });

        console.log ('User data saved:', userData.toJSON());

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.logged_in = true;
            res.redirect('/');

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});
// User Login Verification
router.post('login', async (req, res) => {
    try {
        // Username Validation
        const userData = await User.findOne({ where: {username: req.body.username } });
        if (!userData) {
            res
            .status(400)
            .json({ message: 'Incorrect Username or Password, please try again!' });
            return;
        }
        // Password Validation
        const validPassword = await userData.validPassword(req.body.password);
        if (!validPassword) {
            res
            .status(400)
            .json({ message: 'Incorrect Username or Password, please try again!' });
            return;
        }
        // Session Storage
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.logged_in = true;
            res.redirect('/');

            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});
// User Logout
router.post('logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router