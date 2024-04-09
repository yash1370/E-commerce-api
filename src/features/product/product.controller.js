import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async addProduct(req, res) {
    try {
      const { name, price, sizes, des, categories } = req.body;
      const newProduct = new ProductModel(
        name,
        des,
        parseFloat(price),
        req?.file?.filename,
        categories,
        sizes?.split(",")
      );

      const createdProduct = await this.productRepository.add(newProduct);
      res.status(201).send(createdProduct);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async rateProduct(req, res) {
    try {
      console.log("Hello inside rate product");
      const userId = req.userId;
      const productId = req.body.productId;
      const rating = req.body.rating;
      const error = await this.productRepository.rate(
        userId,
        productId,
        rating
      );
      // console.log(error);
      if (error) {
        return res.status(400).send(error);
      } else {
        return res.status(200).send("Rating has been added");
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send("Product not found");
      } else {
        return res.status(200).send(product);
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      // const maxPrice = req.query.maxPrice;
      const categories = req.query.categories;
      const result = await this.productRepository.filterProduct(
        minPrice,
        // maxPrice,
        categories
      );
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async averagePrice(req, res, next) {
    try {
      const result =
        await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
