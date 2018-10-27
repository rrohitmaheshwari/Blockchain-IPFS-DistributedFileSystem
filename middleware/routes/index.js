let express = require('express');
let router = express.Router();
const config = require('config');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST call for Registering new user. */
router.post('/register', function(req, res, next) {

    //call to mongodb
    req.db.collection("users").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
    });

    res.status(201);
    res.send({ msg: 'User Registered Successfully' });
});



module.exports = router;
