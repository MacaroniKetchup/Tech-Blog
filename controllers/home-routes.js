const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Post, Comment } = require('../models');

router.get('/', withAuth, async (req, res) => {
    try{
        // GET all posts and JOIN with userData
        const postData = await Post.findAll({
            where : {
                user_id: req.session.user_id,
            },
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: ['content'],
                },
            ],
        });
        const posts = postData.map((post) => post.get({ plain: true }));
        // Display all-post.handlebars
        res.render('all-posts', {
            posts,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
// GET one post by id
router.get('/post/:id', withAuth, async (req , res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: ['content', 'created_at'],
                    include: [
                        {
                            model: User,
                            attributes: ['username'],
                        },
                    ],
                },
            ],
        });
        const post = postData.get({ plain: true });
        // display single-post.handlebars
        res.render('single-post', {
            ...post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
// GET sign-up
router.get('/sign-up', async (req, res) => {
    try{
        if (req.session.logged_in) {
            res.redirect('/');
            return;
        }
        // display signup.handlebars
        res.render('sign-up');
    } catch (err) {
        res.status(500).json(err);
    }
});
// GET login
router.get('/login', async (req, res) => {
    try{
        if (req.session.logged_in) {
            res.redirect('/');
            return;
        }
        //display login.handlebars
        res.render('login');
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get

module.exports = router;