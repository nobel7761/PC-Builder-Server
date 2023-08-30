import { NextFunction, Request, Response } from "express";

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const uri =
  "mongodb+srv://pc-builder-admin:UoTTpB2gqPzTY0RO@cluster0.grizk.mongodb.net/pc-builder?retryWrites=true&w=majority";

app.use(express.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await client.connect();
      const productsCollection = client.db("pc-builder").collection("products");

      const products = await productsCollection.find({}).toArray();
      res.status(200).send({ message: "Success", status: 200, data: products });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get(
  "/product/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await client.connect();
      const productsCollection = client.db("pc-builder").collection("products");

      //   const productId = req.query.id as string;
      const product = await productsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });

      if (product) {
        res.status(200).json({ message: "Success", data: product });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
