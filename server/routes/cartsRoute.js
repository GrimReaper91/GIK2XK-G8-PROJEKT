const router = require("express").Router();
const db = require("../models");

const cartService = require("../services/cartService");

router.get("/", (req, res) => {
  cartService.getAll().then((result) => {
    res.status(result.status).json(result.data);
  });
});

router.post("/", (req, res) => {
  const cart = req.body;
  cartService.create(req, res).then((result) => {
    res.status(result.status).json(result.data);
  });
});

router.put("/", (req, res) => {
  const cart = req.body;
  const id = cart.id;
  cartService.update(cart, id).then((result) => {
    res.status(result.status).json(result.data);
  });
});

router.delete("/", (req, res) => {
  const id = req.body.id;
  cartService.destroy(id).then((result) => {
    res.status(result.status).json(result.data);
  });
});
module.exports = router;
