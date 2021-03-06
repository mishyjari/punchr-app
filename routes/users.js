var express = require('express');
var router = express.Router();
var user = require('../ctrl/userCtrl');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users');
});

/* GET New User Form */
router.get('/new', user.new_user_get);

/* Handle POST for new user */
router.post('/new', user.new_user_post);

/* Display list of all users */
router.get('/list', user.list_users);

/* Display details page for a single user */
router.get('/details/:id', user.user_details);

/* Display User Edit Info on GET */
router.get('/details/:id/edit', user.user_edit_get);

/* Handle POST for edit user */
router.post('/details/:id/edit', user.user_edit_post);

/* Display User Delete confirmation page on GET */
router.get('/details/:id/delete', user.user_delete_get);

/* Handle POST for delete user */
router.post('/details/:id/delete', user.user_delete_post);

/* Hanle Register User POST */
//router.post('/register', user.user_register_post);

/* GET login page */
router.get('/login', user.user_login_get);

/* Handle Login POST */ 
router.post('/login', user.user_login_post);

/* Handle Dump GET */
router.get('/dump', user.user_dump_get);

/* GET Protected Page */
router.get('protected', user.protected_get);

module.exports = router;
