"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const uri = "mongodb+srv://pc-builder-admin:UoTTpB2gqPzTY0RO@cluster0.grizk.mongodb.net/pc-builder?retryWrites=true&w=majority";
app.use(express.json());
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.get("/products", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const productsCollection = client.db("pc-builder").collection("products");
        const products = yield productsCollection.find({}).toArray();
        res.status(200).send({ message: "Success", status: 200, data: products });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.get("/product/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const productsCollection = client.db("pc-builder").collection("products");
        //   const productId = req.query.id as string;
        const product = yield productsCollection.findOne({
            _id: new ObjectId(req.params.id),
        });
        if (product) {
            res.status(200).json({ message: "Success", data: product });
        }
        else {
            res.status(404).json({ message: "Product not found" });
        }
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
