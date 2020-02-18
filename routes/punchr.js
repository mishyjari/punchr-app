var express = require('express');
var router = express.Router();
var punchr = require('../ctrl/punchrCtrl.js');

router.get('/', function(req, res, next) {
  res.render('index');
});

// GET Requests for Log Page
router.get('/log', punchr.log_get);

// Handle POST for a new Punchr Entry
router.post('/', punchr.new_post);

// Get Requests for Single Log Entry
router.get('/log/:id', punchr.log_details);


module.exports = router;
