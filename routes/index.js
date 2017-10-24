let express = require('express');
let zerorpc = require('zerorpc');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let client = new zerorpc.Client();
  client.connect("tcp://127.0.0.1:4242");

  client.invoke("hello", "World!", function(error, res, more) {
    console.log(res);
  });

  res.render('index', { title: 'Express' });
});

module.exports = router;
