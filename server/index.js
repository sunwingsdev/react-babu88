const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { upload, deleteFile } = require("./utils");
const path = require("path");

const usersApi = require("./apis/usersApi/usersApi");
const affiliatesApi = require("./apis/usersApi/affiliateApi");
const depositsApi = require("./apis/depositsApi/depositsApi");
const withdrawsApi = require("./apis/withdrawsApi/withdrawsApi");
const homeControlApi = require("./apis/homeControlApi/homeControlApi");
const promotionApi = require("./apis/promotionApi/promotionApi");
const categoriesApi = require("./apis/categoriesApi/categoriesApi");
const kycApi = require("./apis/kycApi/kycApi");
const pagesApi = require("./apis/pagesApi/pagesApi");
const paymentNumberApi = require("./apis/paymentNumberApi/paymentNumberApi");
const paymentMethodApi = require("./apis/paymentMethodApi/paymentMethodApi");
const depositPaymentMethodsApi = require("./apis/depositPaymentMethodsApi/depositPaymentMethodsApi");
const depositPromotionsApi = require("./apis/depositPromotionApi/depositPromotionApi");
const depositTransactionsApi = require("./apis/depositTransactionsApi/depositTransactionsApi"); // New router
const adminDepositTransactionsApi = require("./apis/adminDepositTransactionsApi/adminDepositTransactionsApi");
const withdrawPaymentMethodApi = require("./apis/withdrawPaymentMethodApi/withdrawPaymentMethodApi");
const withdrawTransactionsApi = require("./apis/withdrawTransactionsApi/withdrawTransactionsApi");

const gameApi = require("./apis/gameApi/gameApi");
const adminDashboardApi = require("./apis/adminDashboardApi/adminDashboardApi");

const corsConfig = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    `https://${process.env.SITE_URL}`,
    `http://${process.env.SITE_URL}`,
    `http://www.${process.env.SITE_URL}`,
    `www.${process.env.SITE_URL}`,
    `${process.env.SITE_URL}`,
    "*",
  ],
  credential: true,
  optionSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
};

// Middlewares
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());
// Parse FormData
app.use(express.urlencoded({ extended: true }));
// MongoDB setup
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Serve static files from the "Uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// Routes for image upload and delete
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    filePath: `/uploads/images/${req.file.filename}`,
  });
});

app.delete("/delete", async (req, res) => {
  const { filePath } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: "File path not provided" });
  }
  try {
    await deleteFile(filePath);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Collections
    const usersCollection = client.db("babu88").collection("users");
    const depositsCollection = client.db("babu88").collection("deposits");
    const withdrawsCollection = client.db("babu88").collection("withdraws");
    const promotionCollection = client.db("babu88").collection("promotions");
    const categoriesCollection = client.db("babu88").collection("categories");
    const pagesCollection = client.db("babu88").collection("pages");
    const homeControlsCollection = client
      .db("babu88")
      .collection("homeControls");
    const kycCollection = client.db("babu88").collection("kyc");
   

  

    const withdrawPaymentMethodCollection = client.db("babu88").collection("withdraw-payment-methods");
    const withdrawTransactionsCollection = client.db("babu88").collection("withdrawTransactions");
    const paymentNumberCollection = client
      .db("babu88")
      .collection("payment-numbers");
    const paymentMethodCollection = client
      .db("babu88")
      .collection("payment-methods");
    const depositPaymentMethodCollection = client
      .db("babu88")
      .collection("deposit-payment-methods");
    const depositPromotionsCollection = client
      .db("babu88")
      .collection("depositPromotions");
    const depositTransactionsCollection = client
      .db("babu88")
      .collection("depositTransactions");
    const gamesCollection = client.db("babu88").collection("games");

    // APIs
    app.use("/users", usersApi(usersCollection, homeControlsCollection,withdrawTransactionsCollection));
    app.use("/users", affiliatesApi(usersCollection, homeControlsCollection));
    app.use(
      "/deposits",
      depositsApi(depositsCollection, usersCollection, promotionCollection)
    );
    app.use("/withdraws", withdrawsApi(withdrawsCollection, usersCollection));
    app.use("/home-controls", homeControlApi(homeControlsCollection));
    app.use("/promotions", promotionApi(promotionCollection));
    app.use("/categories", categoriesApi(categoriesCollection));
    app.use("/kyc", kycApi(kycCollection, homeControlsCollection));
    app.use("/pages", pagesApi(pagesCollection));
    app.use("/paymentnumber", paymentNumberApi(paymentNumberCollection));
    app.use("/paymentmethod", paymentMethodApi(paymentMethodCollection));

  app.use(
      "/admin/depositTransactions",
      adminDepositTransactionsApi(depositTransactionsCollection, usersCollection, depositPaymentMethodCollection, depositPromotionsCollection));


     app.use(
      "/depositPaymentMethod",
      depositPaymentMethodsApi(depositPaymentMethodCollection));
    app.use(
      "/depositPromotions",
      depositPromotionsApi(
        depositPromotionsCollection,
        depositPaymentMethodCollection
      )
    );
    app.use(
      "/depositTransactions",
      depositTransactionsApi(

        depositTransactionsCollection,
        usersCollection,
        depositPaymentMethodCollection,
        depositPromotionsCollection
      )
    ); // আপডেটেড রাউট

app.use("/withdrawPaymentMethod", withdrawPaymentMethodApi(withdrawPaymentMethodCollection));
app.use(
      "/withdrawTransactions",
      withdrawTransactionsApi(withdrawTransactionsCollection, usersCollection, withdrawPaymentMethodCollection)
    );
  app.use("/admin", adminDashboardApi(usersCollection, gamesCollection, depositTransactionsCollection, withdrawTransactionsCollection)); // New router

 
    app.use("/games", gameApi(gamesCollection));

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!!!✅");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Default route
app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
