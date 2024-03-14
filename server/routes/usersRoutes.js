const router = require("express").Router();
const db = require("../models");
const validate = require("validate.js");
const cartService = require("../services/cartService");

const constraints = {
  email: {
    length: {
      minimum: 4,
      maximum: 256,
      tooShort: "^Eposten måste vara minst %{count} tecken lång.",
      tooLong: "^Eposten får inte vara längre än %{count} tecken lång.",
    },
    email: {
      message: "^Epostadressen är i ett felaktigt format.",
    },
  },
  firstName: {
    length: {
      minimum: 4,
      maximum: 20,
      tooShort: "^Förnamnet måste vara minst %{count} tecken lång.",
      tooLong: "^Förnamnet får inte vara längre än %{count} tecken lång.",
    },
  },
  lastName: {
    length: {
      minimum: 4,
      maximum: 20,
      tooShort: "^Efternamnet måste vara minst %{count} tecken lång.",
      tooLong: "^Efternamnet får inte vara längre än %{count} tecken lång.",
    },
  },
  imageUrl: {
    url: {
      message: "^Sökvägen är felaktig.",
    },
  },
};

router.get("/:id/carts", (req, res) => {
  const id = req.params.id;
  cartService.getByAuthor(id).then((result) => {
    res.status(result.status).json(result.data);
  });
});

router.get("/", (req, res) => {
  db.user.findAll().then((result) => {
    res.send(result);
  });
});

router.post("/", (req, res) => {
  const user = req.body;
  const invalidData = validate(req.body, constraints);
  if (invalidData) {
    res.status(400).json(invalidData);
  } else {
    db.user.create(req.body).then((result) => {
      res.send(result);
    });
  }
});

router.put("/", (req, res) => {
  const user = req.body;
  const invalidData = validate(req.body, constraints);
  const id = user.id;
  if (invalidData || !id) {
    res.status(400).json(invalidData || "Id är ett måste.");
  } else {
    db.user
      .update(req.body, {
        where: { id: req.body.id },
      })
      .then((result) => {
        res.send(result);
      });
  }
});

router.delete("/", (req, res) => {
  db.user
    .destroy({
      where: { id: req.body.id },
    })
    .then((result) => {
      res.json(`Inlägget raderades`);
    });
});
module.exports = router;
