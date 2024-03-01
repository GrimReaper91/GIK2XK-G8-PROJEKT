const router = require("express").Router();
const db = require("../models");

router.get("/", (req, res) => {
  db.cartRow.findAll().then((result) => {
    res.send(result);
  });
});

router.post("/", (req, res) => {
  const cartRow = req.body;
  db.cartRow.create(req.body).then((result) => {
    res.send(result);
  });
});

router.delete("/", (req, res) => {
  db.cartRow
    .destroy({
      where: { id: req.body.id },
    })
    .then((result) => {
      res.json(`Inlägget raderades ${result}`);
    });
});
module.exports = router;
