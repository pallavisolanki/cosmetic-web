// pages/product/[name].tsx
import { useRouter } from "next/router";
import { products } from "../../src/data/products";
import { Product } from "../../src/types";
import Image from "next/image";
import { useState } from "react";
import {
  FaUndoAlt,
  FaMoneyBillAlt,
  FaStar,
  FaTruck,
  FaLock,
} from "react-icons/fa";
import { slugify } from "../../utils/slugify";
import { useDispatch } from "react-redux";
import { addToCart } from "../../utils/addToCart"; 
import { handlePayment } from "../../utils/paymentHandler"; 


const ProductPage = () => {
  const router = useRouter();
  const { name } = router.query;
  const [quantity, setQuantity] = useState(1);

  const product: Product | undefined = products.find(
    (p) => slugify(p.name) === (name as string)?.toLowerCase()
  );

  const dispatch = useDispatch(); 

  const randomStars = Math.floor(Math.random() * 3) + 3;
  const starString = "★".repeat(randomStars) + "☆".repeat(5 - randomStars);

  if (!product)
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
        Loading or Product not found...
      </div>
    );

  const mrp = product.price + 58; // Dummy MRP for discount
  
  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product, dispatch, router, quantity); 
    }
  };

  const handleBuyNow = async () => {
    const totalAmount = product.price * quantity;
    console.log("Buy Now pressed", { totalAmount, quantity, product });
  
    await handlePayment({
      total: totalAmount,
      cartItems: [], 
      product,
      quantity,
      dispatch,
      router,
      isBuyNow: true,
    });
  };
  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div className="flex justify-center md:justify-start">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="rounded-lg shadow-md object-contain w-full max-w-xs sm:max-w-sm md:max-w-md"
          />
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {product.name}
          </h1>
          <p className="text-yellow-500 text-sm">{starString} (1,285 ratings)</p>
          <p className="text-sm text-gray-500">
            #1 Best Seller in {product.category}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-red-600">-19%</span>
            <span className="text-xl font-semibold text-gray-900">
              ₹{product.price}
            </span>
            <span className="text-sm line-through text-gray-500">
              ₹{mrp}
            </span>
          </div>

          <p className="text-green-700 font-semibold">In stock</p>
          <p className="text-sm text-gray-600">
            Ships from RK World Infocom Pvt Ltd
          </p>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity:
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 w-28 text-sm focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5].map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart} 
              className="bg-pink-500 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-400 transition">
              Buy Now
            </button>
          </div>

          {/* Offers Section */}
          <div className="bg-gray-100 p-4 rounded-md shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-2">Offers</h2>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Cashback: Upto ₹7 on Razor Pay</li>
              <li>Bank Offer: Upto ₹500 off with HDFC cards</li>
              <li>Partner Offer: Buy 3 get extra 2% off</li>
            </ul>
          </div>

          {/* Feature Icons */}
          <div className="flex flex-wrap gap-4 sm:gap-6 mt-4">
            {[ 
              {
                label: "Non-Returnable",
                icon: <FaUndoAlt className="text-3xl text-blue-700" />,
              },
              {
                label: "Cash/Pay on Delivery",
                icon: <FaMoneyBillAlt className="text-3xl text-blue-700" />,
              },
              {
                label: "Top Brand",
                icon: <FaStar className="text-3xl text-blue-700" />,
              },
              {
                label: "Free Delivery",
                icon: <FaTruck className="text-3xl text-blue-700" />,
              },
              {
                label: "Secure transaction",
                icon: <FaLock className="text-3xl text-blue-700" />,
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center w-24 p-3 border border-gray-200 rounded-md hover:shadow-sm transition"
              >
                {feature.icon}
                <p className="mt-2 text-xs font-medium text-gray-700">
                  {feature.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
