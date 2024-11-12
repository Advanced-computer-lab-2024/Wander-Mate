import React from 'react';

export default function Component() {
  return (
    <div className="relative w-full h-screen bg-gray-100">
      <div className="absolute left-[8.5%] right-[8.5%] top-[10.56%] bottom-[51.75%]">
        {/* Product Image */}
        <div className="absolute left-0 right-[68.42%] top-0 bottom-[50.51%]">
          <img
            src="/placeholder.svg"
            alt="Product Image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="absolute left-[34.27%] right-[25.61%] top-0 bottom-0">
          <h1 className="text-2xl font-medium text-[#22262A]">Nike Airmax 270 React</h1>

          {/* Rating */}
          <div className="flex mt-2">
            {[1, 2, 3, 4].map((star) => (
              <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>

          {/* Price */}
          <div className="mt-4">
            <span className="text-2xl font-bold text-blue-500">$299.43</span>
            <span className="ml-2 text-sm line-through text-gray-500">$534.33</span>
            <span className="ml-2 text-sm font-bold text-red-500">24% Off</span>
          </div>

          {/* Product Details */}
          <div className="mt-4 text-sm text-gray-600">
            <p>Availability: In Stock</p>
            <p>Category: Accessories</p>
            <p>Free Shipping</p>
          </div>

          {/* Color Selection */}
          <div className="mt-4">
            <p className="text-sm font-medium">Select Color:</p>
            <div className="flex mt-2 space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              <div className="w-6 h-6 bg-black rounded-full"></div>
              <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mt-4">
            <p className="text-sm font-medium">Size:</p>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>

          {/* Add to Cart */}
          <div className="mt-6">
            <button className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      {/* Product Description Tabs */}
      <div className="absolute left-[0.13%] right-[25.61%] top-[61.68%] bottom-0 bg-gray-50">
        <div className="flex border-b">
          <button className="px-4 py-2 text-sm font-medium text-blue-500 border-b-2 border-blue-500">
            Product Information
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500">
            Reviews (0)
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500">
            Another Tab
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600">
            Air max are always very comfortable fit, clean and just perfect in every way. just the box was too small and scrunched the sneakers up a little bit, not sure if the box was always this small but the 90s are and will always be one of my favorites.
          </p>
        </div>
      </div>
    </div>
  );
}
