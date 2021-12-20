const cors = require("cors");
const express = require("express");
const midtransClient = require("midtrans-client");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();

app.use(cors());

const getCurrentTimestamp = () => {
  return "" + Math.round(new Date().getTime() / 1000);
};

const handleMainRequest = async (req, res) => {
  // Create Snap API instance
  let snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });

  let parameter = {
    transaction_details: {
      order_id: "INV-" + getCurrentTimestamp(),
      gross_amount: req.query.price,
    },
    credit_card: {
      secure: true,
      // "type": "authorize"
    },
    // "gopay": {
    //     "enable_callback": true,
    //     "callback_url": "https://tokoecommerce.com/gopay_finish"
    // },
    customer_details: {
      first_name: req.query.name,
      last_name: "",
      email: req.query.email,
    },
  };

  snap
    .createTransaction(parameter)
    .then((transaction) => {
      res.status(200).json(transaction);
    })
    .catch((err) =>
      res
        .status(401)
        .send(`Error retrieving transactionToken with error: ${err.message}`)
    );
};

app.get("/", handleMainRequest);
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
