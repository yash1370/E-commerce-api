import CartItemsModel from "./cartItems.model.js";

export default class CartItemsController {
  add(req, res) {
    const { productId, quantity } = req.query;
    const userId = req.userId;
    CartItemsModel.add(productId, userId, quantity);
    res.status(201).send("Cart is Updated");
  }
  get(req, res) {
    const userId = req.userId;
    const items = CartItemsModel.get(userId);
    return res.status(200).send(items);
  }
  delete(req, res) {
    const userId = req.userId;
    const cartItemId = req.params.id;
    const error = CartItemsModel.delete(cartItemId.userId);
    if (error) {
      return res.status(400).send(error);
    } else {
      return res.status(200).send("Cart Items is removed");
    }
  }
}
