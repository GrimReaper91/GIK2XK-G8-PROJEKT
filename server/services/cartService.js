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

async function getByProduct(productId) {
  try {
    const product = await db.product.findOne({ where: { id: productId } });
    const allCarts = await product.getCarts({ include: [db.user, db.cartrow] });
    return createResponseSuccess(allCarts.map((cart) => _formatCart(cart)));
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

async function getByAuthor(userId) {
  try {
    const user = await db.user.findOne({ where: { id: userId } });
    const allCarts = await user.getCarts({ include: [db.user, db.cartrow] });
    return createResponseSuccess(allCarts.map((cart) => _formatCart(cart)));
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

async function getById(id) {
  try {
    const cart = await db.cart.findOne({
      where: { id },
      indlude: [
        db.user,
        db.cartrow,
        {
          model: db.product,
          include: [db.user],
        },
      ],
    });
    return createResponseSuccess(_formatCart(cart));
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

async function getAll() {
  try {
    const allCarts = await db.cart.findAll({ include: [db.user, db.cartrow] });
    return createResponseSuccess(allCarts.map((cart) => _formatCart(cart)));
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

async function addProduct(id, product) {
  if (!id) {
    return createResponseError(422, "Id är ett måste!");
  }
  try {
    product.cartId = id;
    const newProduct = await db.product.create(product);
    return createResponseSuccess(newProduct);
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

      //lägg till eventuell skit
      await _addProductToCart(newCart, cart.cartrows);
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
    const existingCart = await db.cart.findOne({ where: { id } });
    if (!existingCart) {
      return createResponseError(404, "Hittade inget inlägg att uppdatera.");
    }
    await _addProductToCart(existingCart, cart.cartrows);
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

function _formatCart(cart) {
  const cleanCart = {
    id: cart.id,
    title: cart.title,
    body: cart.body,
    imageUrl: cart.imageUrl,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
    author: {
      id: cart.user.id,
      username: cart.user.username,
      email: cart.user.email,
      firstName: cart.user.email,
      lastName: cart.user.lastName,
      imageUrl: cart.user.imageUrl,
    },
    cartrows: [],
  };

  if (cart.products) {
    cleanCart.products = [];

    cart.products.map((product) => {
      return (cleanCart.products = [
        {
          title: product.title,
          body: product.body,
          author: product.user.username,
          createdAt: product.createdAt,
        },
        ...cleanCart.cartrows,
      ]);
    });
  }

  if (cart.cartrows) {
    cart.cartrows.map((cartrow) => {
      return (cleanCart.cartrows = [cartrow.name, ...cleanCart.cartrows]);
    });
    return cleanCart;
  }
}

async function _findOrCreateTagId(name) {
  name = name.toLowerCase().trim();
  const foundOrCreatedTag = await db.cartrow.findOrCreate({ where: { name } });

  return foundOrCreatedTag[0].id;
}

async function _addProductToCart(cart, cartrows) {
  if (cartrows) {
    cartrows.forEach(async (cartrow) => {
      const cartrowId = await _findOrCreateTagId(cartrow);
      await cart.addProduct(cartrowId);
    });
  }
}

module.exports = {
  getByProduct,
  getByAuthor,
  getById,
  getAll,
  addProduct,
  create,
  update,
  destroy,
};
