//-------------------++++-----------------
// Importing Required Modules
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
//-------------------++++-----------------

// Set the port
const port = process.env.PORT || 5000;
//-------------------++++-----------------
//Middleware
app.use(cors());
app.use(express.json());
//-------------------++++-----------------

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

// Connection string
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  Collection,
} = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4vti4xu.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //-------------------++++-----------------
    //Collection declare
    const productCollection = client
      .db("storeManagementApp")
      .collection("products");
    // const categoryCollection = client
    //   .db("storeManagementApp")
    //   .collection("categories");

    // ---------Working----------
    const categoryCollection = client
      .db("storeManagementApp")
      .collection("tCategory");
    const subCategoryCollection = client
      .db("storeManagementApp")
      .collection("tSubcategory");
    const subSubCategoryCollection = client
      .db("storeManagementApp")
      .collection("tSubsubcategory");

    const brandCollection = client
      .db("storeManagementApp")
      .collection("brands");

    //-------------------++++-----------------
    // Function to generate a 7-digit productCode with prefix 'P'
    const generateProductCode = async () => {
      // Get the current product count
      const productCount = await productCollection.countDocuments();
      // Increment the count to generate the next product code
      const nextProductCodeNumber = productCount + 1;
      // Generate the 7-digit code with leading zeros and prefix "P"
      const productCode = `P${String(nextProductCodeNumber).padStart(7, "0")}`;
      return productCode;
    };

    // Product Cost Calculation
    const productCostCalculation = async (
      costRMB,
      rmbRate,
      transportCost,
      productQuantity
    ) => {
      // Convert string values to numbers (float or integer)
      const costRMBNum = parseFloat(costRMB);
      const rmbRateNum = parseFloat(rmbRate);
      const transportCostNum = parseFloat(transportCost);
      const productQuantityNum = parseInt(productQuantity, 10); // Integer for quantity

      // Debug: Check converted values
      console.log(costRMBNum, rmbRateNum, transportCostNum, productQuantityNum);

      // Perform the calculation
      const result =
        (costRMBNum * rmbRateNum + transportCostNum) * productQuantityNum;

      return result;
    };

    //-------------------++++-----------------

    //-------+++ Products ++------------
    // Finding
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });
    // Creating
    app.post("/products", async (req, res) => {
      try {
        // Destructure the product details from the request body
        const {
          category,
          subCategory,
          subsubCategory,
          brand,
          inStock,
          productQuantity,
          stockAlert,
          costRMB,
          rmbRate,
          transportCost,
          date,
        } = req.body;

        // Generate the product code
        const productCode = await generateProductCode();
        console.log("Product Code", productCode);

        // Product Cost Calculation
        const productCost = await productCostCalculation(
          costRMB,
          rmbRate,
          transportCost,
          productQuantity
        );

        const productPrice = (parseInt(productCost) * 1.1).toFixed(2);

        console.log(productPrice);

        // Create the new product object
        const newProduct = {
          category,
          subCategory,
          subsubCategory,
          brand,
          inStock,
          productQuantity,
          stockAlert,
          costRMB,
          rmbRate,
          transportCost,
          date,
          productCode, // Assign generated product code here
          productCost,
          productPrice,
        };

        console.log(newProduct);

        // Insert the new product into the collection
        const result = await productCollection.insertOne(newProduct);

        res.send(result);
      } catch (error) {
        console.error("Error while adding product:", error);
        res.status(500).send({ message: "Failed to add product" });
      }
    });

    // Deleting
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
    //-------------------++++-----------------

    //-------------------++++-----------------
    // category: Query for categories
    // app.get("/categories", async (req, res) => {
    //   const result = await categoryCollection.find().toArray();
    //   res.send(result);
    // });
    //-------------------++++-----------------

    //-------------------++++-----------------
    //Query for tCategory
    app.get("/category", async (req, res) => {
      const result = await categoryCollection.find().toArray();
      res.send(result);
    });
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // Direct query
      const result = await categoryCollection.find(query).toArray(); // Pass query directly
      res.send(result);
    });
    //Delete category item
    app.delete("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.deleteOne(query);
      res.send(result);
    });
    // Add Category
    app.post("/category", async (req, res) => {
      const item = req.body;
      const result = await categoryCollection.insertOne(item);
      res.send(result);
    });
    // Edit Category
    app.patch("/category/:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: item.name,
        },
      };
      const result = await categoryCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // -------------- SubCategory -------------------
    // Subcategory find all
    app.get("/subcategory", async (req, res) => {
      const result = await subCategoryCollection.find().toArray();
      res.send(result);
    });
    // Search subcategory item
    app.get("/subcategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // Direct query
      const result = await subCategoryCollection.find(query).toArray(); // Pass query directly
      res.send(result);
    });
    // Search subcategory item
    app.get("/subcategory2/:categoryId", async (req, res) => {
      const categoryId = req.params.categoryId;
      // Since categoryId is stored as a string, do not use ObjectId
      const query = { categoryId: categoryId }; // Compare as string
      const result = await subCategoryCollection.find(query).toArray();
      res.send(result);
    });
    //Delete subcategory item
    app.delete("/subcategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await subCategoryCollection.deleteOne(query);
      res.send(result);
    });
    // Edit subcategory
    app.patch("/subcategory/:id", async (req, res) => {
      const item = req.body;
      console.log(item);
      const id = req.params.id;
      const categoryId = req.params.categoryId;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: item.name,
          categoryId: item.categoryId,
        },
      };
      const result = await subCategoryCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // Add subcategory
    app.post("/subcategory", async (req, res) => {
      const item = req.body;
      const result = await subCategoryCollection.insertOne(item);
      res.send(result);
    });

    // ------------------ Subsubcategoty --------------
    // Subsubcategory
    app.get("/subsubcategory", async (req, res) => {
      const result = await subSubCategoryCollection.find().toArray();
      res.send(result);
    });
    //Find subsubcategory on specific id (_id)
    app.get("/subsubcategory/:subCategoryId", async (req, res) => {
      const id = req.params.subCategoryId;
      // const query = { subCategoryId: new ObjectId(id) }; // subCategoryId
      const query = { _id: new ObjectId(id) }; // _id
      console.log(id);
      const result = await subSubCategoryCollection.find(query).toArray();
      res.send(result);
    });
    //Find subsubcategory on specific id (subCategoryId)
    app.get("/subsubcategory2/:subCategoryId", async (req, res) => {
      const subCategoryId = req.params.subCategoryId;
      const query = { subCategoryId: subCategoryId };
      const result = await subSubCategoryCollection.find(query).toArray();
      res.send(result);
    });
    //Delete subsubcategory item
    app.delete("/subsubcategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await subSubCategoryCollection.deleteOne(query);
      res.send(result);
    });
    // Edit subcategory
    app.patch("/subsubcategory/:id", async (req, res) => {
      const item = req.body;
      console.log(item);
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: item.name,
          subCategoryId: item.subCategoryId,
        },
      };
      const result = await subSubCategoryCollection.updateOne(
        filter,
        updateDoc
      );
      res.send(result);
    });
    // Add subcategory
    app.post("/subsubcategory", async (req, res) => {
      const item = req.body;
      const result = await subSubCategoryCollection.insertOne(item);
      res.send(result);
    });

    //-------------------++++-----------------

    //---------++ For Brands ++--------
    app.get("/brands", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });
    //-------------------++++-----------

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
//-------------------++++-----------------
app.get("/", (req, res) => {
  res.send("SERVER APP is running.!");
});

app.listen(port, () => {
  console.log(`SERVER APP listening on port ${port}`);
});
//-------------------++++-----------------
//-------------------++++-----------------
//
//-------------------++++-----------------
