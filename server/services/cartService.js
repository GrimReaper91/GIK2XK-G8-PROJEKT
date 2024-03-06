const db = require("../models");
const {
  createResponseSuccess,
  createResponseError,
  createResponseMessage,
} = require("../helpers/responseHelpers");
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

async function getAll() {
  try {
    const allCarts = await db.cart.findAll();
    return createResponseSuccess(allCarts);
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

async function create(cart) {
  const invalidData = validate(req.body, constraints);
  if (invalidData) {
    return createResponseError(422, invalidData);
  } else {
    try {
      const newCart = await db.cart.create(cart);
      return createResponseSuccess(newCart);
    } catch (error) {
      return createResponseError(error.status, error.message);
    }
  }
}

async function update(cart, id) {
  const invalidData = validate(req.body, constraints);
  if (!id) {
    return createResponseError(422, "Id är ett måste!");
  }
  if (invalidData) {
    return createResponseError(422, invalidData);
  }
  try {
    await db.cart.update(req.body, {
      where: { id },
    });
    return createResponseMessage(200, "Inlägget uppdaterades.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

async function destroy(id) {
  if (!id) {
    return createResponseError(422, "Id är ett måste!");
  }
  try {
    await db.cart.destroy({
      where: { id },
    });
    return createResponseMessage(200, "Inlägget raderades.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

module.exports = { getAll, create, update, destroy };
