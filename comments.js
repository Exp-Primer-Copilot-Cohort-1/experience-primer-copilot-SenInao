//create web server
var express = require('express');
var router = express.Router();
//require comments controller
var commentsController = require('../controllers/commentsController');
//require comments model
var Comments = require('../models/comments');
//require passport
var passport = require('passport');
//require user model
var User = require('../models/user');
//require campground model
var Campground = require('../models/campground');

//comments new
router.get('/campgrounds/:id/comments/new', isLoggedIn, commentsController.commentsNew);

//comments create
router.post('/campgrounds/:id/comments', isLoggedIn, commentsController.commentsCreate);

//comments edit
router.get('/campgrounds/:id/comments/:comment_id/edit', checkCommentOwnership, commentsController.commentsEdit);

//comments update
router.put('/campgrounds/:id/comments/:comment_id', checkCommentOwnership, commentsController.commentsUpdate);

//comments destroy
router.delete('/campgrounds/:id/comments/:comment_id', checkCommentOwnership, commentsController.commentsDestroy);

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

//middleware
function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comments.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect('back');
            } else {
                //does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

module.exports = router;