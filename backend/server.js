
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const productsRouter = require("./products");

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase connection — keep the secret key on the backend only.
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  console.error("Missing Supabase environment variables in backend/.env");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRouter);

// Convert Supabase database rows to the existing API response format.
function formatOrder(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    address: row.address,
    note: row.note || "",
    items: row.items,
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at
  };
}

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

// Save a customer order to Supabase
app.post("/api/orders", async (req, res) => {
  try {
    const { customer, items, total } = req.body || {};

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

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          name,
          phone,
          address,
          note,
          items,
          total: Number(total) || 0,
          status: "Pending"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase order insert error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Could not save the order. Please try again."
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order received successfully!",
      order: formatOrder(data)
    });
  } catch (error) {
    console.error("Order submission error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while submitting the order."
    });
  }
});

// Get orders for the dashboard
app.get("/api/orders", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase order list error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Could not load orders."
      });
    }

    return res.json({
      success: true,
      orders: data.map(formatOrder)
    });
  } catch (error) {
    console.error("Order list error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while loading orders."
    });
  }
});

// Confirm an order from the dashboard
app.patch("/api/orders/:id/confirm", async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID."
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status: "Confirmed" })
      .eq("id", orderId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase order confirmation error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Could not confirm the order."
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    return res.json({
      success: true,
      message: "Order confirmed successfully!",
      order: formatOrder(data)
    });
  } catch (error) {
    console.error("Order confirmation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while confirming the order."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Nexora server running on port ${PORT}`);
});
