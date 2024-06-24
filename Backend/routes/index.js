var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/api/city", function (req, res, next) {
  req.db
      .from("city")
      .select("name", "district")
      .then((rows) => {
        res.json({ Error: false, Message: "Success", City: rows });
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: true, Message: "Error in MySQL query" });
      });
});

router.get("/api/city/:CountryCode", function (req, res, next) {
  req.db
      .from("city")
      .select("*")
      .where("CountryCode", "=", req.params.CountryCode)
      .then((rows) => {
        res.json({ Error: false, Message: "Success", City: rows });
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: true, Message: "Error in MySQL query" });
      });
});

router.post('/api/update', (req, res, next) => {
  console.log(req.body);

  if (!req.body.City || !req.body.CountryCode || !req.body.Pop) {
    res.status(400).json({ Error: true, Message: "Error updating population"});
    return;
  }

  const filter = { Name: req.body.City, CountryCode: req.body.CountryCode };
  const change = { Population: req.body.Pop };

  req.db.from("city").where(filter).update(change)
      .then(result => {
        console.log(result);
        res.json({Error: false, Message: "Update succeeded"});
      })
      .catch(err => {
        console.log(err);
        res.json({Error: true, Message: "Update failed"});
      });
});

module.exports = router;
