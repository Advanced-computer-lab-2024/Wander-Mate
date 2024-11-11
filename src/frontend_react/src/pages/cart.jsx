import React from 'react'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function ShoppingCart() {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <h1 className="text-xl font-bold">E-Comm</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-blue-500 font-medium">HOME</a>
            <a href="#" className="text-gray-700 font-medium">BAGS</a>
            <a href="#" className="text-gray-700 font-medium">SNEAKERS</a>
            <a href="#" className="text-gray-700 font-medium">BELT</a>
            <a href="#" className="text-gray-700 font-medium">CONTACT</a>
          </nav>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <a href="#" className="text-blue-500">Home</a>
            <span className="text-gray-400">/</span>
            <a href="#" className="text-blue-500">Hot Deal</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">Nike Airmax 270 React</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
              {[1, 2].map((item) => (
                <tr key={item} className="border-b">
                  <td className="py-4 flex items-center space-x-4">
                    <button className="text-red-500">
                      <Trash2 size={20} />
                    </button>
                    <img src="/placeholder.svg" alt="Product" width={100} height={100} className="object-cover" />
                    <span>Nike Airmax 270 react</span>
                  </td>
                  <td className="py-4">$998</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2 bg-gray-100 p-2 w-24">
                      <button className="text-blue-500"><Minus size={16} /></button>
                      <span>2</span>
                      <button className="text-blue-500"><Plus size={16} /></button>
                    </div>
                  </td>
                  <td className="py-4">$499</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cart Summary */}
        <div className="mt-8 flex flex-col md:flex-row justify-between">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <input type="text" placeholder="Voucher code" className="w-full p-2 border rounded" />
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Redeem</button>
          </div>
          <div className="md:w-1/3">
            <div className="bg-gray-100 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>$998</span>
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
                  <span>$118</span>
                </div>
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded mt-4">Check out</button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">E-Comm</h3>
              <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit malesuada dapibus ut pulvinar.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <p className="text-sm text-gray-600">Since the 1500s, when an unknown printer took a galley of type and scrambled.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <p className="text-sm text-gray-600">E-Comm , 4578 Marmora Road, Glasgow D04 89GR</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Information</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>About Us</li>
                <li>Information</li>
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}