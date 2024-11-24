import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus } from 'lucide-react';
import axios from "axios";
import CheckOut from "./checkout";
import { Button } from "./ui/button";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [ID, setUserId] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  // Fetch cart data from backend
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        setUserId(userID);
        const response = await axios.get(
          `http://localhost:8000/showCart/${userID}`
        );
        
        // Deduplicate items by combining quantities for same productId
        const cart = response.data;
        const uniqueItems = [];
        const seenProducts = new Map();

        cart.cart.items.forEach(item => {
          if (seenProducts.has(item.productId)) {
            const existingItem = seenProducts.get(item.productId);
            existingItem.quantity += item.quantity;
          } else {
            seenProducts.set(item.productId, { ...item });
            uniqueItems.push(seenProducts.get(item.productId));
          }
        });

        setCartItems(uniqueItems);
        calculateSubtotal(uniqueItems);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, []);

  const calculateSubtotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(total);
  };

  const handleQuantityChange = async (item, change) => {
    try {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        await handleRemoveItem(item);
        return;
      }

      if (change > 0) {
        await axios.post('http://localhost:8000/addItemToCart', {
          touristID: ID,
          productId: item.productId,
          name: item.name,
          price: item.price,
          picture: item.picture,
          quantity: 1,
          attributes: item.attributes
        });
      } else {
        await axios.post('http://localhost:8000/removeFromCart', {
          touristID: ID,
          productId: item.productId,
          attributes: item.attributes
        });
      }

      // Update the cart items locally
      const updatedItems = cartItems.map(cartItem =>
        cartItem.productId === item.productId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
      setCartItems(updatedItems);
      calculateSubtotal(updatedItems);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      await axios.post('http://localhost:8000/removeFromCart', {
        touristID: ID,
        productId: item.productId,
        attributes: item.attributes
      });

      const updatedItems = cartItems.filter(cartItem => cartItem.productId !== item.productId);
      setCartItems(updatedItems);
      calculateSubtotal(updatedItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleRedeemVoucher = async () => {
    setVoucherError('');
    setIsLoading(true);
    try {
      console.log(`Attempting to redeem voucher: ${voucherCode} for tourist ID: ${ID}`);
      const response = await axios.post(`http://localhost:8000/applyPromoCode/${ID}`, {
        promoCode: voucherCode,
        purchaseAmount: subtotal
      });

      console.log('Promo code response:', response.data);
      const { discountAmount, finalAmount } = response.data;
      setDiscount(discountAmount);
      setSubtotal(finalAmount);
      setVoucherError('');
      setVoucherCode(''); // Clear the voucher code input after successful application
    } catch (error) {
      console.error('Error applying voucher:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setVoucherError(error.response.data.message || 'Failed to apply voucher');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setVoucherError('No response from server. Please try again.');
      } else {
        console.error('Error setting up request:', error.message);
        setVoucherError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">CART PRODUCTS</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4">PRODUCT</th>
                <th className="text-left py-4">PRICE</th>
                <th className="text-left py-4">QTY</th>
                <th className="text-left py-4">TOTAL</th>
                <th className="text-left py-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId} className="border-b">
                  <td className="py-4 flex items-center space-x-4">
                    <img
                      src={item.picture}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-4">${item.price.toFixed(2)}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2 bg-gray-100 p-2 w-24">
                      <button
                        className="text-blue-500"
                        onClick={() => handleQuantityChange(item, -1)}
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="text-blue-500"
                        onClick={() => handleQuantityChange(item, 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="py-4">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="py-4">
                    <button
                      className="text-red-500"
                      onClick={() => handleRemoveItem(item)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between">
          <div className="md:w-1/3 mb-4 md:mb-0 flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2 w-full">
              <input
                type="text"
                placeholder="Voucher code"
                className="w-full p-2 border rounded"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                disabled={isLoading} // Added disabled prop
              />
              <Button 
                className="mt-2 text-white px-4 py-2 rounded" 
                onClick={handleRedeemVoucher}
                disabled={!voucherCode || isLoading} // Added isLoading to disabled condition
              >
                {isLoading ? 'Redeeming...' : 'Redeem'}
              </Button>
            </div>
            {voucherError && <p className="text-red-500 text-sm">{voucherError}</p>}
          </div>
          <div className="md:w-1/3">
            <div className="bg-gray-100 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span>Shipping fee</span>
                <span>$20.00</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-xl">
                  <span>TOTAL</span>
                  <span>${(subtotal + 20 - discount).toFixed(2)}</span>
                </div>
              </div>
              <CheckOut
                touristID={ID}
                amount={subtotal + 20 - discount}
                disabled={cartItems.length === 0}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

