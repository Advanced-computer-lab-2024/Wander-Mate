import { useState, useEffect } from "react";
import ProductCard from "../components/productCard";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton";
import { Slider } from "../components/ui/slider";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]); // Set initial price range
  const [sortOrder, setSortOrder] = useState("rating");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sellerMap, setSellerMap] = useState({});
  const [loading, setLoading] = useState(true);

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

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/viewSellerProducts");
      if (response.ok) {
        const products = await response.json();
        setAllProducts(products);
        setFilteredProducts(products);
      } else {
        console.error("Failed to fetch products:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterAndSort = () => {
    let updatedProducts = allProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          product.price >= priceRange[0] &&
          product.price <= priceRange[1]
      )
      .sort((a, b) => {
        if (sortOrder === "rating") return b.ratings - a.ratings;
        if (sortOrder === "price") return a.price - b.price;
        return 0;
      });
    setFilteredProducts(updatedProducts);
  };

  useEffect(() => {
    fetchSellers();
    fetchProducts();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, priceRange, sortOrder, allProducts]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (e) => setSortOrder(e.target.value);
  const handleMinPriceChange = (e) =>
    setPriceRange([Number(e.target.value), priceRange[1]]);
  const handleMaxPriceChange = (e) =>
    setPriceRange([priceRange[0], Number(e.target.value)]);

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
              <label className="block text-sm font-medium">
                Filter by Price:
              </label>
              <div className="w-64">
                <Slider
                  defaultValue={priceRange}
                  max={1000} // Set max value for the slider
                  onValueChange={(value) => setPriceRange(value)}
                  className="h-4"
                />
                <div className="flex justify-between text-sm mt-2 space-x-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={handleMinPriceChange}
                    className="border p-1 rounded w-20"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={handleMaxPriceChange}
                    className="border p-1 rounded w-20"
                  />
                </div>
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
            Array.from({ length: 6 }).map((_, index) => (
              <ECommerceDefaultSkeleton key={index} />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
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
