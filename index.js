const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const uri =
  "mongodb+srv://pc-builder-admin:di0EQSSG2dWaVY9T@cluster0.grizk.mongodb.net/pc-builder?retryWrites=true&w=majority";

app.use(express.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/products", async (req, res, next) => {
  try {
    await client.connect();
    const database = client.db("pc-builder");
    const productsCollection = database.collection("products");

    const category = req.query.category;

    const filter = category
      ? { category: { $regex: new RegExp(category, "i") } }
      : {};

    const products = await productsCollection.find(filter).toArray();

    if (products) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "Products not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

app.get("/product/:id", async (req, res, next) => {
  try {
    await client.connect();
    const database = client.db("pc-builder");
    const productsCollection = database.collection("products");

    const product = await productsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
