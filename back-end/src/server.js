import express from "express";
import { MongoClient } from "mongodb";
import path from "path";

async function start() {
  const url = `mongodb+srv://priyankhajela1019:5exkqKvUvnXDswlQ@cluster0.nnzayln.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db("fsv-project");

  const app = express();
  app.use(express.json());
  app.use("/images", express.static(path.join(__dirname, "../assets")));

  app.use(
    express.static(path.resolve(__dirname, "../dist"), {
      maxAge: "1y",
      etag: false,
    })
  );

  // helper methods
  async function populateCartIds(ids) {
    return Promise.all(
      ids.map((id) => db.collection("products").findOne({ id }))
    );
  }

  // endpoint to get all products
  app.get("/api/products", async (req, res) => {
    const products = await db.collection("products").find({}).toArray();
    res.json(products);
  });

  // endpoint to get items from the cart
  app.get("/api/users/:userId/cart", async (req, res) => {
    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const populatedCart = await populateCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  // endpoint to get a specific product details
  app.get("/api/products/:productId", async (req, res) => {
    const productId = req.params.productId;
    const product = await db.collection("products").findOne({ id: productId });
    res.json(product);
  });

  // endpoint to ADD item in a cart
  app.post("/api/users/:userId/cart", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    const existingUser = await db.collection("users").findOne({ id: userId });

    if (!existingUser) {
      await db.collection("users").insertOne({ id: userId, cartItems: [] });
    }

    await db.collection("users").updateOne(
      { id: userId },
      {
        $addToSet: { cartItems: productId },
      }
    );
    const user = await db.collection("users").findOne({ id: userId });
    const populatedCart = await populateCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  // endpoint to REMOVE product from a cart
  app.delete("/api/users/:userId/cart/:productId", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    await db.collection("users").updateOne(
      { id: userId },
      {
        $pull: { cartItems: productId },
      }
    );

    const user = await db.collection("users").findOne({ id: userId });
    const populatedCart = await populateCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });

  const port = process.env.PORT || 8000;

  app.listen(port, () => {
    console.log("server is listening on port " + port);
  });
}

start();
