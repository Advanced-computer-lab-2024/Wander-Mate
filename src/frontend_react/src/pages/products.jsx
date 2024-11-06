import { useState, useEffect } from "react";
import ProductCard from "../components/productCard";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton"; // Import the skeleton component

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [sortOrder, setSortOrder] = useState("rating"); // default sort by rating
  const [allProducts, setAllProducts] = useState([]); // Store all fetched products
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sellerMap, setSellerMap] = useState({}); // Map to store seller names by ID
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch sellers from the backend
  const fetchSellers = async () => {
    try {
      const response = await fetch("http://localhost:8000/getSellers");
      if (response.ok) {
        const data = await response.json();
        const map = data.sellers.reduce((acc, seller) => {
          acc[seller._id] = seller.Username;
          return acc;
        }, {});
        setSellerMap(map);
      } else {
        console.error("Failed to fetch sellers:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/viewSellerProducts");
      if (response.ok) {
        const products = await response.json();
        setAllProducts(products);
        setFilteredProducts(products); // Initialize with all products displayed
      } else {
        console.error("Failed to fetch products:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Apply filters and sorting
  const handleFilterAndSort = () => {
    let updatedProducts = allProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          product.price >= priceRange.min &&
          product.price <= priceRange.max
      )
      .sort((a, b) => {
        if (sortOrder === "rating") return b.ratings - a.ratings;
        if (sortOrder === "price") return a.price - b.price;
        return 0;
      });
    setFilteredProducts(updatedProducts);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSellers();
    fetchProducts();
  }, []);

  // Re-run filter and sort when filter criteria change
  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, priceRange, sortOrder, allProducts]);

  // Event handlers for input changes
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handlePriceChange = (min, max) => setPriceRange({ min, max });
  const handleSortChange = (e) => setSortOrder(e.target.value);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-full max-w-sm"
        />
        
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium">Filter by Price:</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceChange(Number(e.target.value), priceRange.max)}
                className="border p-1 rounded w-16"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceChange(priceRange.min, Number(e.target.value))}
                className="border p-1 rounded w-16"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Sort by:</label>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="border p-2 rounded"
            >
              <option value="rating">Rating</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Display skeletons while loading
          Array.from({ length: 6 }).map((_, index) => (
            <ECommerceDefaultSkeleton key={index} />
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              name={product.name}
              description={product.description}
              price={product.price}
              seller={sellerMap[product.seller] || "Unknown"}
              ratings={product.ratings}
              reviews={product.reviews}
              image={`http://localhost:8000/products/${product._id}/image`}
            />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default Products;
