const router = require('express').router();
const withAuth = require('../utils/auth');
const { User, Post, Comment } = require('../models');
const { post } = require('./api');


// GET all Posts and display on homepage for logged_in user
router.get('/', withAuth, async (req , res) => {
    try {
        // GET all posts and JOIN with userData
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id,
            },
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const posts = postData.map((post) => post.get({ plain: true }));
        // display all-posts-user.handlebars
        res.render('all-posts-user', {
            posts,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
// GET edit posts
router.get('/edit/:id', withAuth, async (req , res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });
        const post = postData.get({ plain: true });
        // display edit-posts.handlebars
        res.render('edit-posts', {
            post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
// DELETE for user Posts
router.delete('/api/posts/:id', withAuth, async (req , res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!postData) {
            res.status(404).json({ message: 'No Post(s) found matching this id!' });
            return;
        }
        // display all-posts-user.handlebars
        res.render('all-posts-user', {
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});