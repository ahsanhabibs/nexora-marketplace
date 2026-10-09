
const express = require("express");
const router = express.Router();

const products = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 2500,
    category: "Audio",
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Enjoy clear sound and comfortable listening with these premium headphones.",
    shopName: "Nexora Audio House",
    shopLocation: "Dhaka, Bangladesh",
    stock: 25
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 3200,
    category: "Gadgets",
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    description: "A stylish smart watch for everyday use, fitness tracking and notifications.",
    shopName: "Smart Gadget BD",
    shopLocation: "Dhaka, Bangladesh",
    stock: 18
  },
  {
    id: 3,
    name: "Wireless Speaker",
    price: 1800,
    category: "Audio",
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
    description: "Enjoy your favourite music with this portable wireless speaker.",
    shopName: "Nexora Audio House",
    shopLocation: "Chattogram, Bangladesh",
    stock: 30
  },
  {
    id: 4,
    name: "Premium Backpack",
    price: 2200,
    category: "Lifestyle",
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    description: "A practical backpack for school, work, travel and everyday use.",
    shopName: "Travel & Lifestyle Store",
    shopLocation: "Dhaka, Bangladesh",
    stock: 15
  },
  {
    id: 5,
    name: "Wireless Earbuds",
    price: 1500,
    category: "Audio",
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600",
    description: "Compact wireless earbuds for music, calls and daily activities.",
    shopName: "Sound World BD",
    shopLocation: "Rangpur, Bangladesh",
    stock: 40
  },
  {
    id: 6,
    name: "Gaming Controller",
    price: 2800,
    category: "Gadgets",
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600",
    description: "A gaming controller designed for comfortable gaming sessions.",
    shopName: "Game Zone BD",
    shopLocation: "Dhaka, Bangladesh",
    stock: 12
  }
];

router.get("/", (req, res) => {
  res.json({
    success: true,
    total: products.length,
    products
  });
});

router.get("/:id", (req, res) => {
  const product = products.find(
    item => item.id === Number(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found."
    });
  }

  res.json({
    success: true,
    product
  });
});

module.exports = router;