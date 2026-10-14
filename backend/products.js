const express = require("express");
const router = express.Router();

const products = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 2500,
    category: "Audio",
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900"
    ],
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
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=900",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=900",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900"
    ],
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
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900",
      "https://images.unsplash.com/photo-1608539733292-190446b22b83?w=900",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=900",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900",
      "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=900"
    ],
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
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900",
      "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=900",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=900",
      "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=900",
      "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=900"
    ],
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
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900",
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=900",
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=900",
      "https://images.unsplash.com/photo-1631867675167-90a456a90863?w=900"
    ],
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
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=900",
    images: [
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=900",
      "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=900",
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=900",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900",
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=900"
    ],
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
