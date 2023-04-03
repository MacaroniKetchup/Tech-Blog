const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Post comment with user_id
router.post('/:id', withAuth, async (req, res) => {
    try{
        const newComment = await Comment.create({
            content: req.body.content,
            user_id: req.session.user_id,
            post_id: req.body.post_id,
        });
        res.redirect(`/post/${req.body.post_id}`);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Update Comment with authorized user_id
router.put('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.update(
            {
                content: req.body.content,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        if (!commentData) {
            res.status(404).json ({ message: 'No Comment(s) found matching this id!' });
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete Comment with authorized user_id
router.delete('/:id', withAuth, async (req , res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
                user: req.session.user_id,
            },
        });

        if (!commentData) {
            res.status(404).json({ message: 'No Comment(s) found matching this id!' });
            return;
        }

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Display newComment on Post page
router.get('/:id', withAuth, async (req , res) => {
    try{
        const post = await Post.findByPkg(req.params.id, {
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'content', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
            ],
        });
        if (!post) {
            return res.status(404).json({ message: 'Unable to find Post' });
        }

        const postData = post.get({ plain: true });
        // display comment.handlebars
        res.render('comment', {
            post: postData,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;