import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus } from 'lucide-react';
import axios from "axios";
import CheckOut from "./checkout";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [ID, setUserId] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        setUserId(userID);
        const response = await axios.get(`http://localhost:8000/showCart/${userID}`);
        
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
        toast({
          title: "Error",
          description: "Failed to fetch cart data. Please try again.",
          variant: "destructive",
        });
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

      const updatedItems = cartItems.map(cartItem =>
        cartItem.productId === item.productId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
      setCartItems(updatedItems);
      calculateSubtotal(updatedItems);
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      });
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
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRedeemVoucher = async () => {
    setVoucherError('');
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:8000/previewPromoCode/${ID}`, {
        promoCode: voucherCode,
        purchaseAmount: subtotal
      });

      const { discountAmount, finalAmount } = response.data;
      setDiscount(discountAmount);
      setAppliedPromo({
        code: voucherCode,
        discountAmount,
        finalAmount
      });
      setVoucherCode('');
      toast({
        title: "Promo Code Applied",
        description: `Discount of $${discountAmount.toFixed(2)} will be applied at checkout.`,
      });
    } catch (error) {
      console.error('Error previewing voucher:', error);
      setVoucherError(error.response?.data?.message || 'Failed to preview voucher');
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to preview voucher',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      if (appliedPromo) {
        await axios.post(`http://localhost:8000/applyPromoCode/${ID}`, {
          promoCode: appliedPromo.code,
          purchaseAmount: subtotal
        });
      }
      // Proceed with payment logic here
      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully.",
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
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
                disabled={isLoading || appliedPromo}
              />
              <Button 
                className="mt-2 text-white px-4 py-2 rounded" 
                onClick={handleRedeemVoucher}
                disabled={!voucherCode || isLoading || appliedPromo}
              >
                {isLoading ? 'Applying...' : 'Apply'}
              </Button>
            </div>
            {voucherError && <p className="text-red-500 text-sm">{voucherError}</p>}
            {appliedPromo && (
              <p className="text-green-600 text-sm">
                Promo code applied: ${appliedPromo.discountAmount.toFixed(2)} discount
              </p>
            )}
          </div>
          <div className="md:w-1/3">
            <div className="bg-gray-100 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Discount</span>
                  <span>-${appliedPromo.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span>Shipping fee</span>
                <span>$20.00</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-xl">
                  <span>TOTAL</span>
                  <span>${((appliedPromo ? appliedPromo.finalAmount : subtotal) + 20).toFixed(2)}</span>
                </div>
              </div>
              <CheckOut
                touristID={ID}
                amount={subtotal + 20 - discount}
                disabled={cartItems.length === 0}
                voucherCode={appliedPromo}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

