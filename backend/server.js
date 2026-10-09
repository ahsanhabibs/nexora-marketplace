
const express = require("express");
const cors = require("cors");
const productsRouter = require("./products");

const app = express();
const PORT = 3000;

// Temporary order storage
const orders = [];
let nextOrderId = 1;

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRouter);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to Nexora Marketplace Backend!");
});

// Server status
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "Nexora Marketplace Backend is running!"
  });
});

// Receive customer orders
app.post("/api/orders", (req, res) => {
const { customer, items, total } = req.body;

console.log("ORDER DATA:", JSON.stringify(req.body, null, 2));

const name = customer?.name;
const phone = customer?.phone;
const address = customer?.address;
const note = customer?.note || "";

if (
  !name ||
  !phone ||
  !address ||
  !Array.isArray(items) ||
  items.length === 0
) {
  return res.status(400).json({
    success: false,
    message: "Please provide valid order details."
  });
}
  const order = {
    id: nextOrderId++,
    name,
    phone,
    address,
    note: note || "",
    items,
    total: Number(total) || 0,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  res.status(201).json({
    success: true,
    message: "Order received successfully!",
    order
  });
});

// View all orders (for the future dashboard)
app.get("/api/orders", (req, res) => {
  res.json({
    success: true,
    orders
  });
});

// Confirm an order (for the future dashboard)
app.patch("/api/orders/:id/confirm", (req, res) => {
  const order = orders.find(item => item.id === Number(req.params.id));

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found."
    });
  }

  order.status = "Confirmed";

  res.json({
    success: true,
    message: "Order confirmed successfully!",
    order
  });
});

app.listen(PORT, () => {
  console.log(`Nexora server running at http://localhost:${PORT}`);
});