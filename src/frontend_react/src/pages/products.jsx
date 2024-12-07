import { useState, useEffect } from "react";
import ProductCard from "../components/productCard";
import ECommerceDefaultSkeleton from "../components/ECommerceDefaultSkeleton";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Search, ArrowUpDown } from "lucide-react";
import { Button } from "../components/ui/button";
import NavigationMenuBar from "../components/NavigationMenuBar";
import ProductsTour from "../components/productsTour";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortCriteria, setSortCriteria] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedItemsCount, setLikedItemsCount] = useState(0);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("USD");
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

  const handleLike = () => {
    setLikedItemsCount((prevCount) => prevCount + 1);
  };

  const handleFilterAndSort = () => {
    let updatedProducts = allProducts
      .filter(
        (product) =>
          !product.isArchived &&
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          product.price >= minPrice &&
          product.price <= maxPrice
      )
      .sort((a, b) => {
        if (sortCriteria === "rating") {
          return sortOrder === "asc"
            ? a.ratings - b.ratings
            : b.ratings - a.ratings;
        }
        if (sortCriteria === "price") {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        }
        return 0;
      });
    setFilteredProducts(updatedProducts);
  };

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const c = sessionStorage.getItem("curr");
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${c}`
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
    fetchProducts();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, minPrice, maxPrice, sortCriteria, sortOrder, allProducts]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (value) => setSortCriteria(value);
  const handleSortOrderToggle = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };
  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    setMinPrice(value);
    setPriceRange([value, maxPrice]);
  };
  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    setMaxPrice(value);
    setPriceRange([minPrice, value]);
  };

  return (
    <>
      <NavigationMenuBar likedItemsCount={likedItemsCount} />
      <ProductsTour>
        <div className="container mx-auto p-4" id="container">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="w-full md:w-1/3 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-full md:w-64" id="price-range">
                    <Label
                      htmlFor="price-range"
                      className="text-sm font-medium mb-2 block"
                    >
                      Price Range
                    </Label>
                    <Slider
                      id="price-range"
                      value={priceRange}
                      max={10000}
                      step={1}
                      onValueChange={handlePriceRangeChange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm">
                      <Input
                        type="number"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="w-20 text-right"
                      />
                      <Input
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="w-20 text-right"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <Label
                        htmlFor="sort-criteria"
                        className="text-sm font-medium mb-2 block"
                      >
                        Sort by
                      </Label>
                      <Select
                        onValueChange={handleSortChange}
                        defaultValue={sortCriteria}
                      >
                        <SelectTrigger id="sort-criteria" className="w-[120px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSortOrderToggle}
                      className="mt-6"
                    >
                      <ArrowUpDown
                        className={`h-4 w-4 ${
                          sortOrder === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  price={(
                    product.price / (exchangeRates[currency] || 1)
                  ).toFixed(2)}
                  seller={product.seller || "Unknown"}
                  ratings={product.ratings}
                  reviews={product.reviews}
                  image={`http://localhost:8000/products/${product._id}/image`}
                  quantity={product.quantity}
                  onLike={handleLike}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found
              </p>
            )}
          </div>
        </div>
      </ProductsTour>
    </>
  );
};

export default Products;
