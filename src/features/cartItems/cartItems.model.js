//  productId. userId, quantity

export default class CartItemsModel {
  constructor(productId, userId, quantity, id) {
    this.productId = productId;
    this.userId = userId;
    this.quantity = quantity;
    this.id = id;
  }

  static add(productId, userId, quantity) {
    const cartItem = new CartItemsModel(productId, userId, quantity);
    cartItem.id = cartItems.length + 1;
    cartItems.push(cartItem);
    return cartItem;
  }

  static get(userId) {
    return cartItems.filter((i) => i.userId === userId);
  }

  static delete(cartItemId, userId) {
    const cartItemIndex = cartItems.findIndex(
      (i) => i.id === cartItemId && i.userId === userId
    );
    if (cartItemIndex === -1) {
      return "Item is not found";
    } else {
      return cartItems.splice(cartItemIndex, 1);
    }
  }
}

let cartItems = [
  new CartItemsModel(1, 2, 1, 1),
  new CartItemsModel(1, 1, 2, 2),
];
