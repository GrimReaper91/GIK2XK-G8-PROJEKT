const router = require("express").Router();
const db = require("../models");
const validate = require("validate.js");

const constraints = {
  title: {
    length: {
      minimum: 2,
      maximum: 100,
      tooShort: "^Titlen måste vara minst %{count} tecken lång.",
      tooLong: "^Titeln får inte vara längre än %{count} tecken lång.",
    },
  },
};

router.get("/", (req, res) => {
  db.cart.findAll().then((result) => {
    res.send(result);
  });
});

router.post("/", (req, res) => {
  const cart = req.body;
  const invalidData = validate(req.body, constraints);
  if (invalidData) {
    res.status(400).json(invalidData);
  } else {
    db.cart.create(req.body).then((result) => {
      res.send(result);
    });
  }

  res.send(invalidData);
});

router.put("/", (req, res) => {
  const cart = req.body;
  const invalidData = validate(req.body, constraints);
  const id = cart.id;
  if (invalidData || !id) {
    res.status(400).json(invalidData || "Id är ett måste.");
  } else {
    db.cart
      .update(req.body, {
        where: { id: req.body.id },
      })
      .then((result) => {
        res.send(result);
      });
  }
});

router.delete("/", (req, res) => {
  db.cart
    .destroy({
      where: { id: req.body.id },
    })
    .then((result) => {
      res.json(`Inlägget raderades ${result}`);
    });
});
module.exports = router;
