import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import axios from "axios";
import CheckOut from "./checkout";
import { Button } from "./ui/button";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // Fetch cart data from backend
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        const response = await axios.get(
          `http://localhost:8000/showCart/${userID}`
        ); // Adjust the URL as per your backend route
        const cart = response.data; // Assuming the response contains cart data
        setCartItems(cart.items);
        if (cart.subtotal) {
          setSubtotal(cart.subtotal);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, []); // Empty dependency array means this effect runs only once on mount

  const handleQuantityChange = (itemId, change) => {
    // Handle quantity change (you can make an API call to update the cart in the backend)
  };

  const handleRemoveItem = (itemId) => {
    // Handle item removal (you can make an API call to remove the item from the backend)
  };

  return (
    <div className="bg-white">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">CART PRODUCTS</h2>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4">PRODUCT</th>
                <th className="text-left py-4">PRICE</th>
                <th className="text-left py-4">QTY</th>
                <th className="text-left py-4">UNIT PRICE</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId} className="border-b">
                  <td className="py-4 flex items-center space-x-4">
                    <img
                      src={item.picture} // Assuming the product has an image URL
                      alt={item.name}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-4">${item.price}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2 bg-gray-100 p-2 w-24">
                      <button
                        className="text-blue-500"
                        onClick={() => handleQuantityChange(item.productId, -1)}
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="text-blue-500"
                        onClick={() => handleQuantityChange(item.productId, 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="py-4">${item.total}</td>
                  <td className="py-4">
                    <button
                      className="text-red-500"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cart Summary */}
        <div className="mt-8 flex flex-col md:flex-row justify-between">
          <div className="md:w-1/3 mb-4 md:mb-0 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Voucher code"
              className="w-full p-2 border rounded"
            />
            <Button className="mt-2 text-white px-4 py-2 rounded">
              Redeem
            </Button>
          </div>
          <div className="md:w-1/3">
            <div className="bg-gray-100 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping fee</span>
                <span>$20</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Coupon</span>
                <span>No</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-xl">
                  <span>TOTAL</span>
                  <span>${subtotal + 20}</span>
                </div>
              </div>
              <CheckOut />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
